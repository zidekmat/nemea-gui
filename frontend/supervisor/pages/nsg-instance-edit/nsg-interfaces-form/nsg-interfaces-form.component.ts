import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NsgInterface} from "../../../models/nsg-interface";
import {NsgModule} from "../../../models/nsg-module";
import {NsgInstance} from "../../../models/nsg-instance";
import {NsgModal} from "../../../services/nsg-modal.service";
import {NsgInstancesService} from "../../../services/nsg-instances.service";
import {NsgModulesService} from "../../../services/nsg-modules.service";

@Component({
    selector: 'nsg-interfaces-form',
    templateUrl: './nsg-interfaces-form.component.html',
    styleUrls: ['./nsg-interfaces-form.component.scss'],
    providers: [NsgModal, NsgInstancesService, NsgModulesService]
})
export class NsgInterfacesFormComponent implements OnInit {

    @Input() nsgInstance: NsgInstance;
    /* Whether this component is used for editing
     * existing instance or creating new one */
    @Input() isEditForm: boolean;

    /* Notifies parent component that some data were changed here */
    @Output() onChildEdited = new EventEmitter<NsgInstance>();

    /* Am I currently updating old interface or creating
     *  a new one */
    addingIfc: boolean;

    resetIfcVals: string; // JSON string copy of selectedIfc
    selectedIfc: NsgInterface;

    ifcTypes = NsgInterface.types;
    ifcDirections = NsgInterface.directions;

    backendErrors: string[];

    constructor(private nsgModalService: NsgModal,
                private nsgModulesService: NsgModulesService,
                private nsgInstancesService: NsgInstancesService) {
        this.backendErrors = [];
    }

    ngOnInit() {
        console.log('init');
        console.log(this.nsgInstance)
    }

    selectIfc(ifc: NsgInterface) {
        this.addingIfc = false;
        this.selectedIfc = ifc;
        console.log('selected')
        console.log(ifc);
        this.resetIfcVals = JSON.stringify(ifc);
    }

    removeIfc(ifc: NsgInterface) {
        this.backendErrors = [];
        if (this.isEditForm) {
            this.nsgInstancesService.updateInstance(this.nsgInstance.name, this.nsgInstance).subscribe(
                () => {
                    this.onChildEdited.emit();

                    if (this.selectedIfc != null && this.selectedIfc.name == ifc.name) {
                        this.selectedIfc = null;
                    }

                    this.nsgInstance.removeIfc(ifc);
                },
                (error) => {
                    console.log('Failed to remove interface:');
                    console.log(error);
                    this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
                }
            );
        } else {
            if (this.selectedIfc != null && this.selectedIfc.name == ifc.name) {
                this.selectedIfc = null;
            }

            this.nsgInstance.removeIfc(ifc);
        }
    }

    createNewIfc() {
        console.log('creating ifc');
        this.addingIfc = true;
        this.selectedIfc = NsgInterface.newFromInstance(this.nsgInstance);
        this.resetIfcVals = JSON.stringify(this.selectedIfc);
    }

    resetIfc() {
        console.log('resetting ifc');
        this.selectedIfc = new NsgInterface(JSON.parse(this.resetIfcVals));
    }

    saveIfc(ifcForm) {
        this.backendErrors = [];
        if (this.isEditForm) {
            if (this.addingIfc) {
                this.nsgInstance.addIfc(this.selectedIfc);
                this.nsgInstancesService.updateInstance(
                    this.nsgInstance.name,
                    this.nsgInstance).subscribe(
                    () => {
                        this.selectedIfc = null;
                        this.onChildEdited.emit();
                    },
                    (error) => {
                        console.log('Error adding new ifc:');
                        console.log(error);
                        this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
                    }
                );
            } else {
                this.nsgInstancesService.updateInstance(
                    this.nsgInstance.name,
                    this.nsgInstance).subscribe(
                    () => {
                        this.selectedIfc = null;
                        console.log('emitting edit');
                        console.log(this.nsgInstance);
                        this.onChildEdited.emit();
                    },
                    (error) => {
                        console.log('Error updating ifc:');
                        console.log(error);
                        this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
                    }
                );
            }
        } else {
            if (this.addingIfc) {
                this.nsgInstance.addIfc(this.selectedIfc);
            }
            this.selectedIfc = null;
        }
    }
}
