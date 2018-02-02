import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'app/utils/auth.guard';

import {NsgModuleDetailComponent} from "./nsg-module-detail/nsg-module-detail.component";
import {NsgModuleNewComponent} from "./nsg-module-new/nsg-module-new.component";

@Component({
  selector: 'nsg-modules',
  templateUrl: './nsg-modules.component.html',
  styleUrls: ['./nsg-modules.component.scss']
})
export class NsgModulesComponent implements OnInit {

  static readonly childrenRoutes = [
    {
      path : '',
      component: NsgModulesComponent,
      canActivate : [AuthGuard],
      data : {
        role : 10,
        label: ''
      }
    },
    {
      path : 'nsg-module-detail',
      component: NsgModuleDetailComponent,
      canActivate : [AuthGuard],
      data : {
        role : 10,
        label: ''
      }
    },
    {
      path : 'nsg-module-new',
      component: NsgModuleNewComponent,
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
