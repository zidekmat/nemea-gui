import {Component, OnInit, ViewChild} from '@angular/core';
import {NsgModule2} from "../../models/nsg-module2";
import {NsgModuleEditJsonFormComponent} from "../../components/nsg-module-edit-json-form/nsg-module-edit-json-form.component";
import {NsgModuleEditPlainFormComponent} from "../../components/nsg-module-edit-plain-form/nsg-module-edit-plain-form.component";
import {NsgModulesService} from "../nsg-modules.service";

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

    nsgModule: NsgModule2;

    constructor() {
        this.nsgModule = {
            name: '',
            is_nemea_mod: false,
            is_sr_ready: false,
            sr_cb_ready: false,
            in_ifces_cnt: '0',
            out_ifces_cnt: '0',
        };
    }

    ngOnInit() {
    }

    /**
     * This is information from on of child forms that module was saved with
     * values passed in `module`.
     */
    onEdited(module: NsgModule2) {
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
