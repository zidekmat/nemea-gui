import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/utils/auth.guard';


// Supervisor GUI main components
import {NsgInstancesComponent} from "./nsg-instances/nsg-instances.component";
import {NsgModulesComponent} from "./nsg-modules/nsg-modules.component";
import {NsgHowToComponent} from "./nsg-how-to/nsg-how-to.component";
import {NsgStatusComponent} from "./nsg-status/nsg-status.component";

@Component({
  selector: 'supervisor-gui',
  templateUrl: './supervisor-gui.component.html',
  styleUrls: ['./supervisor-gui.component.scss']
})
export class SupervisorGuiComponent implements OnInit {

  static readonly childrenRoutes = [
      {
          path : 'nsg-status',
          component: NsgStatusComponent,
          canActivate : [AuthGuard],
          data : {
              role : 10,
              label: ''
          }
      },
      {
          path : 'nsg-modules',
          component: NsgModulesComponent,
          canActivate : [AuthGuard],
          data : {
              role : 10,
              label: ''
          },
          children: NsgModulesComponent.childrenRoutes
      },
      {
          path : 'nsg-instances',
          component: NsgInstancesComponent,
          canActivate : [AuthGuard],
          data : {
              role : 10,
              label: ''
          },
          children: NsgInstancesComponent.childrenRoutes
      },
      {
          path : 'nsg-how-to',
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