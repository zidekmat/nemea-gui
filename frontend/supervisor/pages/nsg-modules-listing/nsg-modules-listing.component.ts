import { Component, OnInit, OnChanges } from '@angular/core';

import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModule} from "../../models/nsg-module";
import {ErrParserService} from "../../services/err-parser.service";

@Component({
  selector: 'nsg-modules-listing',
  templateUrl: './nsg-modules-listing.component.html',
  styleUrls: ['./nsg-modules-listing.component.scss'],
  providers: [NsgModulesService,ErrParserService]
})
export class NsgModulesListingComponent implements OnInit {

    nsgModules : NsgModule[];
    backendErrors: any[];

    constructor(private nsgModulesService: NsgModulesService,
                private errParser: ErrParserService) { }

    ngOnInit() {
        this.getModules();
        this.backendErrors = [];
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
                this.backendErrors = this.errParser.toArr(error);
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
                this.backendErrors = this.errParser.toArr(error);
            }
        );
    }

}
