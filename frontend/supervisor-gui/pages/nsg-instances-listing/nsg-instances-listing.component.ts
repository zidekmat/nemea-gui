import { Component, OnInit } from '@angular/core';
import {NsgInstance} from "../../models/nsg-instance";
import {NsgInstancesService} from "../nsg-instances.service";

@Component({
  selector: 'nsg-instances-listing',
  templateUrl: './nsg-instances-listing.component.html',
  styleUrls: ['./nsg-instances-listing.component.scss'],
  providers: [NsgInstancesService]
})
export class NsgInstancesListingComponent implements OnInit {

  nsgInstances : Object[];

  constructor(private nsgInstancesService: NsgInstancesService) { }

  ngOnInit() {
    this.nsgInstances = this.nsgInstancesService.getAllInstances();
    console.log(this.nsgInstances);
  }

}
