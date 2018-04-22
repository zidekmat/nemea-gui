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

    constructor(private nsgInstancesService: NsgInstancesService) {
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
            }
        );
    }

    startInstance(instance : NsgInstance) {
        this.nsgInstancesService.startInstance(instance.name).subscribe(
            () => {
                instance.running = true;
                instance.enabled = true;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error starting instance:');
                console.log(error);
            }
        );
    }

    stopInstance(instance : NsgInstance) {
        this.nsgInstancesService.stopInstance(instance.name).subscribe(
            () => {
                instance.running = false;
                instance.enabled = false;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error stopping instance:');
                console.log(error);
            }
        );
    }

    restartInstance(instance : NsgInstance) {
        instance.restarting = true;
        this.nsgInstancesService.restartInstance(instance.name).subscribe(
            () => {
                instance.running = true;
                setTimeout(() => instance.restarting = false, this.statusTimeout);
            },
            (error) => {
                console.log('Error restarting instance:');
                console.log(error);
            }
        );
    }

}
