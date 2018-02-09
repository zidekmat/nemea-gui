import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NsgModule} from "../../models/nsg-module";
import {NsgModulesService} from "../nsg-modules.service";

@Component({
  selector: 'nsg-module-detail',
  templateUrl: './nsg-module-detail.component.html',
  styleUrls: ['./nsg-module-detail.component.scss'],
  providers: [NsgModulesService]
})
export class NsgModuleDetailComponent implements OnInit {

  nsgModule : NsgModule;

  constructor(private nsgModulesService: NsgModulesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
      const moduleName = this.route.snapshot.paramMap.get('module');
      this.nsgModulesService.getModule(moduleName).subscribe(
          (module) => {console.log('received:');console.log(this.nsgModule); this.nsgModule = module; }
      );
      console.log('subscribed:');
      console.log(this.nsgModule);
  }

}
