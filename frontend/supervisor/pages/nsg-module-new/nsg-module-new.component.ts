import {Component, OnInit, ViewChild} from '@angular/core';
import {NsgModule} from "../../models/nsg-module";
import {NsgModuleEditComponent} from "../nsg-module-edit/nsg-module-edit.component";
import {NsgModulesService} from "../../services/nsg-modules.service";

@Component({
    selector: 'nsg-module-new',
    templateUrl: './nsg-module-new.component.html',
    styleUrls: ['./nsg-module-new.component.scss'],
    providers: [NsgModulesService]
})
export class NsgModulesNewComponent implements OnInit {

    @ViewChild(NsgModuleEditComponent)
    private editForm: NsgModuleEditComponent;

    nsgModule: NsgModule;

    constructor() {
        this.nsgModule = NsgModule.newFromDefaults();
    }

    ngOnInit() {
    }

    /* This is information from one of children forms that module
     * was edited with values passed in `module`. */
    onChildEdited(module: NsgModule) {
        console.log('onEdited in new');
        console.log(module);
        this.nsgModule = module;

        // update default values in both children
        this.editForm.passedModule = this.nsgModule;
        this.editForm.resetForm();
    }
}
