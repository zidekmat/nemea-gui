import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NsgModule} from "../../../../../models/nsg-module";
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
    @Input() passedModule: NsgModule;

    /**
     * Whether this component is used for editing existing module
     * or creating new one
     */
    @Input() isEditForm: boolean;

    @Output() onChildSaved = new EventEmitter<NsgModule>();
    @Output() onChildEdited = new EventEmitter<NsgModule>();

    yangModel: NsgYangModel;
    nsgModuleJson: string;
    backendErrors: any[];

    constructor(private nsgYangService: NsgYangService,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        // TODO
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
        this.nsgModuleJson = this.passedModule.apiJson();
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
        const nsgInstance = NsgModule.newFromApi(this.nsgModuleJson);

        const onSuccess = () => {
            this.onChildSaved.emit(nsgInstance);
            this.router.navigate(
                [`/nemea/supervisor-gui/instances/${nsgInstance.name}`],
                {fragment: 'info'}
            );
        };
        const onError = (error) => {
            console.log('HTTP failed:');
            console.log(error);
            this.backendErrors = error.json();
        };

        if (this.isEditForm) {
            console.log('updating module json');
            this.nsgModulesService.updateModule(
                this.passedModule.name,
                nsgInstance
            ).subscribe(onSuccess, onError);
        } else {
            this.nsgModulesService.createModule(
                nsgInstance
            ).subscribe(onSuccess, onError);
        }
    }

    onFormEdit(form) {
        if (form.valid && !form.submitted) {
            console.log(form);
            this.onChildEdited.emit(NsgModule.newFromApi(this.nsgModuleJson));
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
