import {Component, OnInit, OnChanges} from '@angular/core';
import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInstance2} from "../../models/nsg-instance2";

@Component({
    selector: 'nsg-instances-listing',
    templateUrl: './nsg-instances-listing.component.html',
    styleUrls: ['./nsg-instances-listing.component.scss'],
    providers: [NsgInstancesService]
})
export class NsgInstancesListingComponent implements OnInit {

    nsgInstances: NsgInstance2[];

    constructor(private nsgInstancesService: NsgInstancesService) {
    }

    ngOnInit() {
        this.getInstances();
    }

    ngOnChanges() {
        this.getInstances();
    }

    exportAsSrJsonData(instance: NsgInstance2) {
        const instanceJson = JSON.stringify({
            'nemea:supervisor': {
                'module': [
                    instance
                ]
            }
        });

        let a = document.createElement("a");
        const blob = new Blob([instanceJson], {type: 'application/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = `${instance.name}.conf-backup.json`;
        a.click();
    }

    removeInstance(instance: NsgInstance2) {
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
                // TODO
            }
        );
    }

    getInstances() {
        this.nsgInstancesService.getAllInstances().subscribe(
            (nsgInstances) => {
                this.nsgInstances = nsgInstances;
            },
            (error) => {
                console.log('Error getting instances list:');
                console.log(error);
                // TODO
            }
        );
    }

    startInstance(instance : NsgInstance2) {
        this.nsgInstancesService.startInstance(instance.name).subscribe(
            () => {
                instance.running = true;
            },
            (error) => {
                console.log('Error starting instance:');
                console.log(error);
                // TODO
            }
        );
    }

    stopInstance(instance : NsgInstance2) {
        this.nsgInstancesService.stopInstance(instance.name).subscribe(
            () => {
                instance.running = false;
            },
            (error) => {
                console.log('Error stopping instance:');
                console.log(error);
                // TODO
            }
        );
    }

    restartInstance(instance : NsgInstance2) {
        this.nsgInstancesService.restartInstance(instance.name).subscribe(
            () => {
                instance.running = true;
            },
            (error) => {
                console.log('Error restarting instance:');
                console.log(error);
                // TODO
            }
        );
    }

}
