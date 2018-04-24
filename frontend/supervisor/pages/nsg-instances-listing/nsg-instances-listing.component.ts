import {Component, OnInit, OnChanges} from '@angular/core';
import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInstance} from "../../models/nsg-instance";
import {ErrParserService} from "../../services/err-parser.service";

@Component({
    selector: 'nsg-instances-listing',
    templateUrl: './nsg-instances-listing.component.html',
    styleUrls: ['./nsg-instances-listing.component.scss'],
    providers: [NsgInstancesService, ErrParserService]
})
export class NsgInstancesListingComponent implements OnInit {

    statusTimeout = 3000;

    nsgInstances: NsgInstance[];
    backendErrors: any[];

    constructor(private nsgInstancesService: NsgInstancesService,
                private errParser: ErrParserService) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.getInstances();
    }

    removeInstance(instance: NsgInstance) {
        this.backendErrors = [];
        this.nsgInstancesService.removeInstance(instance.name).subscribe(
            () => {
                // Remove instance from viewed list
                this.nsgInstances = this.nsgInstances.filter(
                    instIter => instIter != instance
                );
            },
            (error) => {
                console.log('Error removing instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    getInstances() {
        this.backendErrors = [];
        this.nsgInstancesService.getAllInstances().subscribe(
            (nsgInstances) => {
                this.nsgInstances = nsgInstances;
            },
            (error) => {
                console.log('Error getting instances list:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
                this.nsgInstances = [];
            }
        );
    }

    startInstance(instance : NsgInstance) {
        this.backendErrors = [];
        instance.restarting = true;
        this.nsgInstancesService.startInstance(instance.name).subscribe(
            () => {
                instance.running = true;
                instance.enabled = true;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error starting instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    stopInstance(instance : NsgInstance) {
        this.backendErrors = [];
        instance.restarting = true;
        this.nsgInstancesService.stopInstance(instance.name).subscribe(
            () => {
                instance.running = false;
                instance.enabled = false;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error stopping instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

    restartInstance(instance : NsgInstance) {
        this.backendErrors = [];
        instance.restarting = true;
        this.nsgInstancesService.restartInstance(instance.name).subscribe(
            () => {
                instance.running = true;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error restarting instance:');
                console.log(error);
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

}
