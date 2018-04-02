import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NsgInstancesService} from "../../../../../services/nsg-instances.service";
import {NsgInstance} from "../../../../../models/nsg-instance";
import {NsgYangModel} from "../../../../../models/nsg-yang-model";
import {NsgYangService} from "../../../../../services/nsg-yang.service";

@Component({
    selector: 'nsg-instance-edit-json-form',
    templateUrl: './nsg-instance-edit-json-form.component.html',
    styleUrls: ['./nsg-instance-edit-json-form.component.scss'],
    providers: [NsgYangService, NsgInstancesService]
})
export class NsgInstanceEditJsonFormComponent implements OnInit {
    /**
     * Instance to be changed
     */
    @Input() passedInstance: NsgInstance;

    /**
     * Whether this component is used for editing existing module
     * or creating new one
     */
    @Input() isEditForm: boolean;

    @Output() onChildSaved = new EventEmitter<NsgInstance>();
    @Output() onChildEdited = new EventEmitter<NsgInstance>();

    yangModel: NsgYangModel;
    nsgInstanceJson: string;
    backendErrors: any[];

    constructor(private nsgYangService: NsgYangService,
                private nsgInstancesService: NsgInstancesService,
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
            this.nsgInstanceJson = reader.result;
            this.beautifyJson();
        };
        if ($event.target.files.length > 0) {
            reader.readAsText($event.target.files[0]);
        }
    }

    resetForm() {
        this.nsgInstanceJson = this.passedInstance.apiJson();
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
        let nsgInstance: NsgInstance;
        try {
            nsgInstance = NsgInstance.newFromApi(this.nsgInstanceJson);
        } catch (e) {
            this.backendErrors = [e];
            return;
        }


        let onSuccess = () => {
            this.onChildSaved.emit(nsgInstance);
            this.router.navigate(
                [`/nemea/supervisor-gui/instances/${nsgInstance.name}`],
                {fragment: 'info'}
            );
        };
        let onError = (error) => {
            console.log(error);
            this.backendErrors = error.json();
        };


        if (this.isEditForm) {
            console.log('updating instance json');
            this.nsgInstancesService.updateInstance(
                this.passedInstance.name,
                nsgInstance
            ).subscribe(onSuccess, onError);
        } else {
            console.log('creating instance json');
            this.nsgInstancesService.createInstance(
                nsgInstance
            ).subscribe(onSuccess, onError);
        }
    }
    onFormEdit(form) {
        if (form.valid && !form.submitted) {
            const nsgInstance = NsgInstance.newFromApi(this.nsgInstanceJson);
            this.onChildEdited.emit(nsgInstance);
        }
    }
    beautifyJson() {
        try {
            this.nsgInstanceJson = JSON.stringify(
                JSON.parse(this.nsgInstanceJson), null, '  '
            );
        } catch (e) {
        }
    }
}
