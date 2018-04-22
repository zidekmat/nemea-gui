import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NsgModule} from "../../models/nsg-module";
import {NsgModulesService} from "../../services/nsg-modules.service";
import {NsgModuleEditComponent} from "../nsg-module-edit/nsg-module-edit.component";
import {NsgInstance} from "../../models/nsg-instance";
import {NsgInstancesService} from "../../services/nsg-instances.service";

@Component({
    selector: 'nsg-module-detail',
    templateUrl: './nsg-module-detail.component.html',
    styleUrls: ['./nsg-module-detail.component.scss'],
    providers: [NsgModulesService, NsgInstancesService]
})
export class NsgModuleDetailComponent implements OnInit {

    @ViewChild(NsgModuleEditComponent)
    private editForm: NsgModuleEditComponent;

    nsgModule: NsgModule;
    nsgInstances: NsgInstance[];
    moduleNotFound = false;

    constructor(private nsgModulesService: NsgModulesService,
                private nsgInstancesService: NsgInstancesService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        const moduleName = this.route.snapshot.paramMap.get('module');
        this.nsgModulesService.getModule(moduleName).subscribe(
            (module) => {
                console.log('received:');
                console.log(module);
                this.nsgModule = module;
                console.log(this.nsgModule);
            },
            (error) => {
                if (error.status == 404) {
                    this.moduleNotFound = true;
                } else {
                    console.log('Failed to load module:');
                    console.log(error);
                }
            }
        );
        this.nsgInstancesService.getAllInstancesByModuleName(moduleName).subscribe(
            (insts) => this.nsgInstances = insts,
            (error) => {
                console.log('Failed to load instances of module:');
                console.log(error);
            }
        );
    }

    /* This is information from one of child forms that module was
     * saved with values passed in `module`. */
    onChildSaved(module: NsgModule) {
        console.log('onSaved in detail');
        console.log(module);
        this.nsgModule = module;

        // update default values in both children
        this.editForm.passedModule = this.nsgModule;
        this.editForm.resetForm();
    }

    onChildEdited(module: NsgModule) {
        console.log('onEdited in detail');
        console.log(module);

        // Edit working values of both forms
        this.editForm.nsgModule = module;
    }

    removeModule() {
        this.nsgModulesService.removeModule(this.nsgModule.name)
            .subscribe(
            () => {
                this.router.navigate(['/nemea/supervisor/modules'])
            },
            (error) => {
                console.log('Failed to remove module:')
                console.log(error);
            }
        );
    }

    removeInstance(inst: NsgInstance) {
        this.nsgInstancesService.removeInstance(inst.name).subscribe(
            () => {
                this.nsgInstances = this.nsgInstances
                    .filter(
                        instIter => instIter != inst
                    );
                console.log(`instance ${inst.name} deleted`);
            },
            (error) => {
                console.log('Failed to remove instance:');
                console.log(error);
            }
        );
    }

}
