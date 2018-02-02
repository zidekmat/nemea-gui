import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/utils/auth.guard';

import {NsgInstanceNewComponent} from "./nsg-instance-new/nsg-instance-new.component";
import {NsgInstanceDetailComponent} from "./nsg-instance-detail/nsg-instance-detail.component";

@Component({
  selector: 'nsg-instances',
  templateUrl: './nsg-instances.component.html',
  styleUrls: ['./nsg-instances.component.scss']
})
export class NsgInstancesComponent implements OnInit {

  static readonly childrenRoutes = [
    {
      path : '',
      component: NsgInstancesComponent,
      canActivate : [AuthGuard],
      data : {
          role : 10,
          label: ''
      }
    },
    {
      path : 'nsg-instance-detail',
      component: NsgInstanceDetailComponent,
      canActivate : [AuthGuard],
      data : {
        role : 10,
        label: ''
      }
    },
    {
      path : 'nsg-instance-new',
      component: NsgInstanceNewComponent,
      canActivate : [AuthGuard],
      data : {
        role : 10,
        label: ''
      }
    },
  ];

  constructor() { }

  ngOnInit() {
  }

}
