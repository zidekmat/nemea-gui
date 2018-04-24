import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInterface} from "../../models/nsg-interface";
import {NsgInstance} from "../../models/nsg-instance";
import {NsgInstanceStats} from "../../models/nsg-instance-stats";
import {NsgInstanceEditComponent} from "../nsg-instance-edit/nsg-instance-edit.component";
import {ErrParserService} from "../../services/err-parser.service";

@Component({
    selector: 'nsg-instance-detail',
    templateUrl: './nsg-instance-detail.component.html',
    styleUrls: ['./nsg-instance-detail.component.scss'],
    providers: [NsgInstancesService, ErrParserService]
})
export class NsgInstanceDetailComponent implements OnInit {

    @ViewChild(NsgInstanceEditComponent)
    private editForm: NsgInstanceEditComponent;

    statusTimeout = 3000;
    instName: string;
    nsgInstance: NsgInstance;
    nsgInstanceStats: NsgInstanceStats;
    selectedIfc: NsgInterface;
    instanceNotFound = false;
    Math: any;
    backendErrors: any[];

    constructor(private nsgInstancesService: NsgInstancesService,
                private route: ActivatedRoute,
                private router: Router,
                private errParser: ErrParserService) {
        this.Math = Math;
        this.backendErrors = [];
    }

    ngOnInit() {
        this.instName = this.route.snapshot.paramMap.get('instance');
        this.nsgInstanceStats = null;
        this.fetchInstance();
    }

    fetchInstance() {
        this.nsgInstancesService.getInstance(this.instName).subscribe(
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
                this.nsgInstance.restarting = false;
            },
            (error) => {
                if (error.status == 404) {
                    console.log('Service: instance not found');
                    this.instanceNotFound = true;
                } else {
                    console.log('Failed to get instance: ');
                    console.log(error);
                    this.backendErrors = this.errParser.toArr(error);
                }
            }
        );

        this.nsgInstancesService.getInstanceStats(this.instName).subscribe(
            (stats) => {
                console.log('received stats');
                console.log(stats);
                this.nsgInstanceStats = stats;
            },
            (error) => {
                console.log('Failed to get instance stats:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
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
        this.nsgInstance.restarting = true;
        this.nsgInstancesService.removeInstance(this.nsgInstance.name).subscribe(
            () => {
                this.router.navigate(['/nemea/supervisor-gui/instances'])
            },
            (error) => {
                console.log('Failed to remove instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    startInstance() {
        this.nsgInstance.restarting = true;
        this.nsgInstancesService.startInstance(this.nsgInstance.name).subscribe(
            () => {
                setTimeout(() => {this.fetchInstance()}, this.statusTimeout);
            },
            (error) => {
                console.log('Error starting instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    stopInstance() {
        this.nsgInstance.restarting = true;
        this.nsgInstancesService.stopInstance(this.nsgInstance.name).subscribe(
            () => {
                setTimeout(() => {this.fetchInstance()}, this.statusTimeout);
            },
            (error) => {
                console.log('Error stopping instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    restartInstance() {
        this.nsgInstance.restarting = true;
        this.nsgInstancesService.restartInstance(this.nsgInstance.name).subscribe(
            () => {
                setTimeout(() => {this.fetchInstance()}, this.statusTimeout);
            },
            (error) => {
                console.log('Error restarting instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    selectInterface(ifc: NsgInterface) {
        this.selectedIfc = ifc;
    }

}
