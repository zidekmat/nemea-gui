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

    constructor(private nsgModulesService: NsgModulesService) { }

    ngOnInit() {
        this.getModules();
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
        this.nsgModulesService.removeModule(module.name).subscribe(
            () => {
                this.nsgModules = this.nsgModules.filter(
                    modIter => modIter != module
                );
            },
            (error) => {
                console.log('Failed to remove module:');
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
                console.log('Failed to load modules:');
                console.log(error);
            }
        );
    }

}
