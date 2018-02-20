import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/utils/auth.guard';


// Nemea Supervisor GUI main components
import {NsgStatusComponent} from "./pages/nsg-status/nsg-status.component";
import {NsgHowToComponent} from "./pages/nsg-how-to/nsg-how-to.component";

import {NsgModulesListingComponent} from "./pages/nsg-modules-listing/nsg-modules-listing.component";
import {NsgModulesNewComponent} from "./pages/nsg-module-new/nsg-module-new.component";
import {NsgModuleDetailComponent} from "./pages/nsg-module-detail/nsg-module-detail.component";

import {NsgInstancesListingComponent} from "./pages/nsg-instances-listing/nsg-instances-listing.component";
import {NsgInstancesNewComponent} from "./pages/nsg-instance-new/nsg-instance-new.component";
import {NsgInstanceDetailComponent} from "./pages/nsg-instance-detail/nsg-instance-detail.component";

@Component({
  selector: 'supervisor-gui',
  templateUrl: './supervisor-gui.component.html',
  styleUrls: ['./supervisor-gui.component.scss'],
})
export class SupervisorGuiComponent implements OnInit {

  static readonly childrenRoutes = [
      {
          path : '',
          component: NsgStatusComponent,
          canActivate : [AuthGuard],
          data : {
              role : 10,
              label: ''
          }
      },
      {
        path: 'modules',
        component: NsgModulesListingComponent,
        canActivate: [AuthGuard],
        data: {
          role: 10,
          label: ''
        },
      },
      {
        path : 'modules/new',
        component: NsgModulesNewComponent,
        canActivate : [AuthGuard],
        data : {
          role : 10,
          label: ''
        },
      },
      {
        path : 'modules/:module',
        component: NsgModuleDetailComponent,
        canActivate : [AuthGuard],
        data : {
          role : 10,
          label: ''
        }
      },
      {
        path: 'instances',
        component: NsgInstancesListingComponent,
        canActivate: [AuthGuard],
        data: {
          role: 10,
          label: ''
        }
      },
      {
        path : 'instances/new',
        component: NsgInstancesNewComponent,
        canActivate : [AuthGuard],
        data : {
          role : 10,
          label: ''
        }
      },
      {
        path : 'instances/:instance',
        component: NsgInstanceDetailComponent,
        canActivate : [AuthGuard],
        data : {
          role : 10,
          label: ''
        }
      },
      {
          path : 'how-to',
          component: NsgHowToComponent,
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