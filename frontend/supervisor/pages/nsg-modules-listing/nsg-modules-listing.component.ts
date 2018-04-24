import { Component, OnInit, OnChanges } from '@angular/core';

import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModule} from "../../models/nsg-module";

@Component({
  selector: 'nsg-modules-listing',
  templateUrl: './nsg-modules-listing.component.html',
  styleUrls: ['./nsg-modules-listing.component.scss'],
  providers: [NsgModulesService]
})
export class NsgModulesListingComponent implements OnInit {

    nsgModules : NsgModule[];
    backendErrors: any[];

    constructor(private nsgModulesService: NsgModulesService) { }

    ngOnInit() {
        this.getModules();
        this.backendErrors = [];
    }

    ngOnChanges() {
        this.getModules();
    }

    exportAsSrJsonData(module: NsgModule) {
        let a = document.createElement("a");
        const blob = new Blob([module.apiJson()], { type: 'application/json' });
        a.href = window.URL.createObjectURL(blob);
        a.download = `${module.name}.conf-backup.json`;
        a.click();
    }

    removeModule(module: NsgModule) {
        this.backendErrors = [];
        this.nsgModulesService.removeModule(module.name).subscribe(
            () => {
                this.nsgModules = this.nsgModules.filter(
                    modIter => modIter != module
                );
            },
            (error) => {
                console.log('Failed to remove module:');
                console.log(error);
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
            }
        );
    }

    getModules() {
        this.backendErrors = [];
        this.nsgModulesService.getAllModules().subscribe(
            (nsgModules) => {
                this.nsgModules = nsgModules;
            },
            (error) => {
                console.log('Failed to load modules:');
                console.log(error);
                this.backendErrors = error.json()['message'].slice(0,-1).split("\n");
            }
        );
    }

}
