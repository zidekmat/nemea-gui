import {Component, OnInit, OnChanges} from '@angular/core';
import {NsgInstancesService} from "../../services/nsg-instances.service";
import {NsgInstance} from "../../models/nsg-instance";

@Component({
    selector: 'nsg-instances-listing',
    templateUrl: './nsg-instances-listing.component.html',
    styleUrls: ['./nsg-instances-listing.component.scss'],
    providers: [NsgInstancesService]
})
export class NsgInstancesListingComponent implements OnInit {

    statusTimeout = 3000;

    nsgInstances: NsgInstance[];
    backendErrors: any[];

    constructor(private nsgInstancesService: NsgInstancesService) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.getInstances();
    }

    ngOnChanges() {
        this.getInstances();
    }

    exportAsSrJsonData(instance: NsgInstance) {
        let a = document.createElement("a");
        const blob = new Blob([instance.apiJson()], {type: 'application/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = `${instance.name}.conf-backup.json`;
        a.click();
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
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
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
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
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
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
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
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
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
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
            }
        );
    }

}
