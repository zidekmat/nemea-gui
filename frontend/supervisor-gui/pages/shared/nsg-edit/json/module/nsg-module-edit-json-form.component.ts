import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NsgModule2} from "../../../../../models/nsg-module2";
import {NsgYangService} from "../../../../../services/nsg-yang.service";
import {NsgYangModel} from "../../../../../models/nsg-yang-model";
import {NsgModulesService} from "../../../../../services/nsg-modules.service";

@Component({
    selector: 'nsg-module-edit-json-form',
    templateUrl: './nsg-module-edit-json-form.component.html',
    styleUrls: ['./nsg-module-edit-json-form.component.scss'],
    providers: [NsgYangService, NsgModulesService]
})
export class NsgModuleEditJsonFormComponent implements OnInit {

    /**
     * Module to be changed
     */
    @Input() passedModule: NsgModule2;

    /**
     * Whether this component is used for editing existing module
     * or creating new one
     */
    @Input() isEditForm: boolean;

    @Output() onSaved = new EventEmitter<NsgModule2>();
    @Output() onEdited = new EventEmitter<NsgModule2>();

    yangModel: NsgYangModel;
    nsgModuleJson: string;
    backendErrors: any[];

    constructor(private nsgYangService: NsgYangService,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.nsgYangService.getModelForXpath("").subscribe(
            (model) => {
                this.yangModel = model;
            },
            (error) => {
                console.log(error);
                // TODO onError
            }
        );
        this.resetForm();
    }

    insertFromFile($event: any) {
        let reader = new FileReader();
        console.log('insert file called');
        reader.onloadend = (e) => {
            console.log('onloaded');
            this.nsgModuleJson = reader.result;
            this.beautifyJson();
        };
        if ($event.target.files.length > 0) {
            reader.readAsText($event.target.files[0]);
        }
    }

    resetForm() {
        let srAvModule = JSON.parse(JSON.stringify(this.passedModule));

        // Form JSON object parsable by sysrepo
        delete srAvModule.instances;
        this.nsgModuleJson = JSON.stringify({
            "nemea:supervisor": {
                "available-module": [
                    srAvModule
                ]
            }
        });
        this.beautifyJson();
    }

    updateYangModel() {
        this.nsgYangService.getModelForXpath("", this.yangModel.type).subscribe(
            (model) => {
                this.yangModel = model;
            },
            (error) => {
                console.log(error);
                // TODO onError
            }
        );
    }


    onSubmit() {
        console.log('submitting module json');
        const nsgModule : NsgModule2 = JSON.parse(this.nsgModuleJson)['nemea:supervisor']['available-module'][0];

        if (this.isEditForm) {
            console.log('updating module json');
            this.nsgModulesService.updateModule(
                this.passedModule.name,
                nsgModule
            ).subscribe(
                (module) => {
                    this.onSaved.emit(nsgModule);
                    this.router.navigate(
                        [`/nemea/supervisor-gui/module/${nsgModule.name}`],
                        {fragment: 'info'}
                    )
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        } else {
            this.nsgModulesService.createModule(nsgModule).subscribe(
                (resp) => {
                    console.log(resp);
                    this.onSaved.emit(nsgModule);
                    this.router.navigate(
                        [`/nemea/supervisor-gui/module/${nsgModule.name}`],
                        {fragment: 'info'}
                    )
                },
                (error) => {
                    console.log('create failed with error response:')
                    console.log(error);
                    this.backendErrors = error.json().errors;
                }
            );
        }
    }

    onFormEdit(form) {
        console.log(form);
        if (form.valid && !form.submitted) {
            console.log(form);
            const nsgModule : NsgModule2 = JSON.parse(this.nsgModuleJson)['nemea:supervisor']['available-module'][0];
            this.onEdited.emit(nsgModule);
        }
    }

    beautifyJson() {
        try {
            this.nsgModuleJson = JSON.stringify(
                JSON.parse(this.nsgModuleJson), null, '  '
            );
        } catch (e) {
        }
    }
}
