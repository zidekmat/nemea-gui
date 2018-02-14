import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NsgModule2} from "../../models/nsg-module2";
import {NsgModulesService} from "../nsg-modules.service";
import {NsgModuleEditPlainFormComponent} from "../../components/nsg-module-edit-plain-form/nsg-module-edit-plain-form.component";
import {NsgModuleEditJsonFormComponent} from "../../components/nsg-module-edit-json-form/nsg-module-edit-json-form.component";
import {NsgInstance2} from "../../models/nsg-instance2";
import {NsgInstancesService} from "../nsg-instances.service";

@Component({
    selector: 'nsg-module-detail',
    templateUrl: './nsg-module-detail.component.html',
    styleUrls: ['./nsg-module-detail.component.scss'],
    providers: [NsgModulesService, NsgInstancesService]
})
export class NsgModuleDetailComponent implements OnInit {


    @ViewChild(NsgModuleEditPlainFormComponent)
    private plainFormComponent: NsgModuleEditPlainFormComponent;
    @ViewChild(NsgModuleEditJsonFormComponent)
    private jsonFormComponent: NsgModuleEditJsonFormComponent;

    nsgModule: NsgModule2;
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
                    console.log('HTTP error:');
                    console.log(error);
                    //TODO
                }
            }
        );
    }

    /**
     * This is information from on of child forms that module was saved with
     * values passed in `module`.
     */
    onSaved(module: NsgModule2) {
        console.log('onSaved in detail');
        console.log(module);
        this.nsgModule = module;

        // update default values in both children
        this.plainFormComponent.passedModule = this.nsgModule;
        this.plainFormComponent.resetForm();
        this.jsonFormComponent.passedModule = this.nsgModule;
        this.jsonFormComponent.resetForm();
    }

    onEdited(module: NsgModule2) {
        console.log('onEdited in detail');
        console.log(module);

        // Edit working values of both forms
        this.plainFormComponent.nsgModule = module;
        this.jsonFormComponent.nsgModuleJson = JSON.stringify({
            "nemea:supervisor": {
                "available-module": [
                    module
                ]
            }
        });
        this.jsonFormComponent.beautifyJson();
    }

    removeModule() {
        this.nsgModulesService.removeModule(this.nsgModule.name)
            .subscribe(
            () => {
                this.router.navigate(['/nemea/supervisor-gui/modules'])
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

    removeInstance(inst: NsgInstance2) {
        this.nsgInstancesService.remove(inst.name).subscribe(
            () => {
                // TODO
                this.nsgModule.instances = this.nsgModule.instances
                    .filter(
                        instIter => instIter != inst
                    );
                console.log(`instance ${inst.name} deleted`);
            },
            (error) => {
                // TODO
                console.log(error);
            }
        );
    }

}
