import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NsgInterface} from "../../../../../../models/nsg-interface";
import {NsgModule} from "../../../../../../models/nsg-module";
import {NsgInstance} from "../../../../../../models/nsg-instance";
import {NsgModal} from "../../../../../../services/nsg-modal.service";
import {NsgInstancesService} from "../../../../../../services/nsg-instances.service";
import {NsgModulesService} from "../../../../../../services/nsg-modules.service";

@Component({
    selector: 'nsg-interfaces-form',
    templateUrl: './nsg-interfaces-form.component.html',
    styleUrls: ['./nsg-interfaces-form.component.scss'],
    providers: [NsgModal, NsgInstancesService, NsgModulesService]
})
export class NsgInterfacesFormComponent implements OnInit {

    @Input() nsgInstance: NsgInstance;

    /* Notifies parent component that some data were changed here */
    @Output() onChildEdited = new EventEmitter<NsgInstance>();

    /* Am I currently updating old interface or creating
     *  a new one */
    addingIfc: boolean;

    prefillIfcName: string;
    nsgIfcesNamesList: string[];
    
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
        this.updateIfcesNamesList();
    }


    updateIfcesNamesList() {
        let getName = (ifc) => ifc.name;
        this.nsgIfcesNamesList = this.nsgInstance.in_ifces.map(getName).concat(this.nsgInstance.out_ifces.map(getName));
    }

    selectIfc(ifc: NsgInterface) {
        this.addingIfc = false;
        this.selectedIfc = ifc;
        this.resetIfcVals = JSON.stringify(ifc);
    }

    removeIfc(ifc: NsgInterface) {
        this.nsgInstancesService.removeInterface(this.nsgInstance.name, ifc.name).subscribe(
            () => {
                this.nsgInstance.removeIfc(ifc);
                this.onChildEdited.emit();
            },
            (error) => {
                console.log('Failed to remove interface:');
                console.log(error);
            }
        );
    }

    createNewIfc() {
        this.addingIfc = true;
        this.selectedIfc = NsgInterface.newFromInstance(this.nsgInstance);
        this.resetIfcVals = JSON.stringify(this.selectedIfc);
    }

    resetIfc() {
        console.log('resetting ifc');
        this.selectedIfc = JSON.parse(this.resetIfcVals);
    }

    saveIfc(ifcForm) {
        //if (ifcForm.valid &&
        if (this.addingIfc) {
            this.nsgInstancesService.addInterface(
                this.nsgInstance.name,
                this.selectedIfc).subscribe(
                () => {
                    this.nsgInstance.addIfc(this.selectedIfc);
                    this.updateIfcesNamesList();
                    this.selectedIfc = null;
                    this.onChildEdited.emit();
                },
                (resp) => {
                    console.log('Error adding new ifc:');
                    console.log(resp);
                    console.log(resp.errors);
                    this.backendErrors = resp.json().errors;
                }
            );
        } else {
            this.nsgInstancesService.updateInterface(
                this.nsgInstance.name,
                JSON.parse(this.resetIfcVals).name,
                this.selectedIfc).subscribe(
                () => {
                    this.nsgInstance.addIfc(this.selectedIfc);
                    this.updateIfcesNamesList();
                    this.selectedIfc = null;
                    // TODO notify instance
                },
                (resp) => {
                    console.log('Error updating ifc:');
                    console.log(resp);
                    this.backendErrors = resp.json().errors;
                }
            );
        }
    }

    prefill() {
        console.log('prefilling ifc');

        this.nsgInstancesService.getInterface(this.nsgInstance.name, this.prefillIfcName).subscribe(
            (ifc) => {
                this.selectedIfc = ifc;
                this.nsgModalService.closeNsgModal();
            },
            (error) => {
                console.log('Error getting ifc:');
                console.log(error);
                // TODO onError
            }
        );
    }
}
