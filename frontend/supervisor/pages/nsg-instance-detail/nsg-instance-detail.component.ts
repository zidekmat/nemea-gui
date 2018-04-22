import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInterface} from "../../models/nsg-interface";
import {NsgInstance} from "../../models/nsg-instance";
import {NsgInstanceEditComponent} from "../nsg-instance-edit/nsg-instance-edit.component";

@Component({
    selector: 'nsg-instance-detail',
    templateUrl: './nsg-instance-detail.component.html',
    styleUrls: ['./nsg-instance-detail.component.scss'],
    providers: [NsgInstancesService]
})
export class NsgInstanceDetailComponent implements OnInit {

    @ViewChild(NsgInstanceEditComponent)
    private editForm: NsgInstanceEditComponent;

    nsgInstance: NsgInstance;
    selectedIfc: NsgInterface;
    instanceNotFound = false;

    constructor(private nsgInstancesService: NsgInstancesService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const instName = this.route.snapshot.paramMap.get('instance');
        this.nsgInstancesService.getInstance(instName).subscribe(
            (inst) => {
                console.log('Received instance:');
                console.log(JSON.stringify(inst));
                this.nsgInstance = inst;
                if (this.nsgInstance.in_ifces.length > 0) {
                    this.selectedIfc = this.nsgInstance.in_ifces[0];
                } else if (inst.out_ifces.length > 0) {
                    this.selectedIfc = this.nsgInstance.out_ifces[0];
                } else {
                    this.selectedIfc = undefined;
                }

                console.log(this.nsgInstance);
            },
            (error) => {
                if (error.status == 404) {
                    console.log('Service: instance not found');
                    this.instanceNotFound = true;
                } else {
                    console.log('Service error: ');
                    console.log(error);
                    //TODO
                }
            }
        );
    }

    onChildSaved(inst: NsgInstance) {
        console.log('onChildSaved in detail');
        console.log(inst);
        this.nsgInstance = inst;

        // update default values in both children
        this.editForm.passedInstance = this.nsgInstance;
        this.editForm.resetForm();
    }

    onChildEdited(inst: NsgInstance) {
        console.log('onChildEdited in detail');
        console.log(inst);

        // Edit working values of both forms
        this.editForm.nsgInstance = inst;
        this.editForm.fetchModule();
    }

    removeInstance() {
        this.nsgInstancesService.removeInstance(this.nsgInstance.name).subscribe(
            () => {
                this.router.navigate(['/nemea/supervisor/instances'])
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

    removeInterface(ifc: NsgInterface) {
        this.nsgInstance.removeIfc(ifc);
        this.nsgInstancesService.updateInstance(this.nsgInstance.name, this.nsgInstance).subscribe(
            () => {
                console.log(`interface ${ifc.name} deleted`);
            },
            (error) => {
                console.log('Failed to remove interface:');
                console.log(error);
            }
        );
    }

    selectInterface(ifc: NsgInterface) {
        this.selectedIfc = ifc;
    }

}
