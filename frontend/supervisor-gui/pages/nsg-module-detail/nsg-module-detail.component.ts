import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NsgModule2} from "../../models/nsg-module2";
import {NsgModulesService} from "../nsg-modules.service";
import {NsgModuleEditPlainFormComponent} from "../../components/nsg-module-edit-plain-form/nsg-module-edit-plain-form.component";
import {NsgModuleEditXmlFormComponent} from "../../components/nsg-module-edit-xml-form/nsg-module-edit-xml-form.component";

@Component({
    selector: 'nsg-module-detail',
    templateUrl: './nsg-module-detail.component.html',
    styleUrls: ['./nsg-module-detail.component.scss'],
    providers: [NsgModulesService]
})
export class NsgModuleDetailComponent implements OnInit {


    @ViewChild(NsgModuleEditPlainFormComponent)
    private plainFormComponent: NsgModuleEditPlainFormComponent;
    @ViewChild(NsgModuleEditXmlFormComponent)
    private xmlFormComponent: NsgModuleEditXmlFormComponent;

    nsgModule: NsgModule2;

    constructor(private nsgModulesService: NsgModulesService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        const moduleName = this.route.snapshot.paramMap.get('module');
        this.nsgModulesService.getModule(moduleName).subscribe(
            (module) => {
                console.log('received:');
                console.log(this.nsgModule);
                this.nsgModule = module;
            },
            (error) => {
                console.log(error);
                //TODO
            }
        );
    }

    /**
     * This is information from on of child forms that module was saved with
     * values passed in `module`.
     */
    onEdited(module: NsgModule2) {
        console.log('onEdited in detail');
        this.nsgModule = module;

        // update default values in both children
        this.plainFormComponent.passedModule = this.nsgModule;
        this.xmlFormComponent.passedModule = this.nsgModule;
    }

}
