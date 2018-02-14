import { Component, OnInit, OnChanges } from '@angular/core';

import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModule2} from "../../models/nsg-module2";

@Component({
  selector: 'nsg-modules-listing',
  templateUrl: './nsg-modules-listing.component.html',
  styleUrls: ['./nsg-modules-listing.component.scss'],
  providers: [NsgModulesService]
})
export class NsgModulesListingComponent implements OnInit {

    nsgModules : NsgModule2[];

    constructor(private nsgModulesService: NsgModulesService) { }

    ngOnInit() {
        this.getModules();
    }

    ngOnChanges() {
        this.getModules();
    }

    exportAsSrJsonData(module: NsgModule2) {
        const moduleJson = JSON.stringify({
            'nemea:supervisor': {
                'available-module': [
                    module
                ]
            }
        });

        let a = document.createElement("a");
        const blob = new Blob([moduleJson], { type: 'application/json' });
        a.href = window.URL.createObjectURL(blob);
        a.download = `${module.name}.conf-backup.json`;
        a.click();
    }

    removeModule(module: NsgModule2) {
        this.nsgModulesService.removeModule(module.name).subscribe(
            () => {
                this.nsgModules = this.nsgModules.filter(
                    modIter => modIter != module
                );
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

    getModules() {
        this.nsgModulesService.getAllModules().subscribe(
            (nsgModules) => {
                this.nsgModules = nsgModules;
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

}
