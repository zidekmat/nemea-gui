import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NsgInstancesService} from "../../../../../services/nsg-instances.service";
import {NsgInstance2} from "../../../../../models/nsg-instance2";
import {NsgYangModel} from "../../../../../models/nsg-yang-model";
import {NsgYangService} from "../../../../../services/nsg-yang.service";

@Component({
  selector: 'nsg-instance-edit-plain-form',
  templateUrl: './nsg-instance-edit-plain-form.component.html',
  styleUrls: ['./nsg-instance-edit-plain-form.component.scss'],
  providers: [NsgInstancesService]
})
export class NsgInstanceEditPlainFormComponent implements OnInit {
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

    nsgInstance: NsgInstance2; // NsgModule model that is currently edited
    prefillFromInstance: string;
    backendErrors: any[];
    prefillModal: any;
    nsgInstancesList: NsgInstance2[];

    constructor(private modalService: NgbModal,
                private nsgModulesService: NsgInstancesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {

    }

    resetForm() {

    }

    prefill() {

    }

    onSubmit() {

    }

    onFormEdit(form) {

    }
}
