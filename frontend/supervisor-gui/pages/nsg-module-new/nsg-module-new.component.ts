import {Component, OnInit, ViewChild} from '@angular/core';
import {NsgModule} from "../../models/nsg-module";
import {NsgModuleEditJsonFormComponent} from "../shared/nsg-edit/json/module/nsg-module-edit-json-form.component";
import {NsgModuleEditPlainFormComponent} from "../shared/nsg-edit/plain/module/nsg-module-edit-plain-form.component";
import {NsgModulesService} from "../../services/nsg-modules.service";

@Component({
    selector: 'nsg-module-new',
    templateUrl: './nsg-module-new.component.html',
    styleUrls: ['./nsg-module-new.component.scss'],
    providers: [NsgModulesService]
})
export class NsgModulesNewComponent implements OnInit {

    @ViewChild(NsgModuleEditPlainFormComponent)
    private plainFormComponent: NsgModuleEditPlainFormComponent;
    @ViewChild(NsgModuleEditJsonFormComponent)
    private jsonFormComponent: NsgModuleEditJsonFormComponent;

    nsgModule: NsgModule;

    constructor() {
        this.nsgModule = NsgModule.newFromDefaults();
    }

    ngOnInit() {
    }

    /* This is information from one of children forms that module
     * was edited with values passed in `module`. */
    onEdited(module: NsgModule) {
        console.log('onEdited in new');
        console.log(module);
        this.nsgModule = module;

        // update default values in both children
        this.plainFormComponent.passedModule = this.nsgModule;
        this.plainFormComponent.resetForm();
        this.jsonFormComponent.passedModule = this.nsgModule;
        this.jsonFormComponent.resetForm();
    }
}
