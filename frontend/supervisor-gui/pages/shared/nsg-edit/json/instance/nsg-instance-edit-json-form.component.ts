import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {NsgInstancesService} from "../../../../../services/nsg-instances.service";
import {NsgInstance2} from "../../../../../models/nsg-instance2";
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
    @Input() passedInstance: NsgInstance2;

    /**
     * Whether this component is used for editing existing module
     * or creating new one
     */
    @Input() isEditForm: boolean;

    @Output() onSaved = new EventEmitter<NsgInstance2>();
    @Output() onEdited = new EventEmitter<NsgInstance2>();

    yangModel: NsgYangModel;
    nsgInstanceJson: string;
    backendErrors: any[];

    constructor(private nsgYangService: NsgYangService,
                private nsgInstancesService: NsgInstancesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {

    }

    insertFromFile($event: any) {

    }

    resetForm() {

    }

    updateYangModel() {

    }
    onSubmit() {

    }
    onFormEdit(form) {

    }
    beautifyJson() {

    }
}
