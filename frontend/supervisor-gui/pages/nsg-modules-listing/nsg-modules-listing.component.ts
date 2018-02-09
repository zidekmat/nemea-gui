import { Component, OnInit } from '@angular/core';

import {NsgModulesService} from "../nsg-modules.service";
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
        this.nsgModulesService.getAllModules().subscribe(
            (modules) => {console.log('received:');console.log(modules);this.nsgModules = modules}
        );
        console.log('subscribed:');
    }

}
