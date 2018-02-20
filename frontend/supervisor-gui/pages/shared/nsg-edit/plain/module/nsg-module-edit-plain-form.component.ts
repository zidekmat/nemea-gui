import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NsgModule} from "../../../../../models/nsg-module";
import {NsgModulesService} from "../../../../../services/nsg-modules.service";
import {NsgModal} from "../../../../../services/nsg-modal.service";

@Component({
    selector: 'nsg-module-edit-plain-form',
    templateUrl: './nsg-module-edit-plain-form.component.html',
    styleUrls: ['./nsg-module-edit-plain-form.component.scss'],
    providers: [NsgModulesService, NsgModal]
})
export class NsgModuleEditPlainFormComponent implements OnInit {


    /* Module to be changed */
    @Input() passedModule: NsgModule;

    /* Whether this component is used for editing
     * existing instance or creating new one */
    @Input() isEditForm: boolean;

    /* Both are used to notify detail component
     * to update data in JSON tab */
    @Output() onChildSaved = new EventEmitter<NsgModule>();
    @Output() onChildEdited = new EventEmitter<NsgModule>();

    nsgModule: NsgModule; // NsgModule model that is currently edited
    prefillFromModule: string;
    backendErrors: any[];

    nsgModsNamesList: string[];

    constructor(private nsgModalService: NsgModal,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.resetForm();
        this.nsgModulesService.getAllModulesNames().subscribe(
            (data) => {
                this.nsgModsNamesList = data;
            },
            (error) => {
                console.log('Error fetching modules list:');
                console.log(error);
                // TODO
            }
        );
    }

    resetForm() {
        this.nsgModule = JSON.parse(JSON.stringify(this.passedModule));
    }

    prefill() {
        this.nsgModulesService.getModule(this.prefillFromModule).subscribe(
            (module) => {
                this.nsgModule = module;
                this.nsgModalService.closeNsgModal();
            },
            (error) => {
                console.log(error);
                // TODO onError
            }
        );
    }

    onSubmit() {
        console.log('submitting module');

        if (this.isEditForm) {
            console.log('updating module');
            this.nsgModulesService.updateModule(this.passedModule.name, this.nsgModule).subscribe(
                (module) => {
                    this.onChildSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/modules/${this.nsgModule.name}`], {fragment: 'info'})
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        } else {
            this.nsgModulesService.createModule(this.nsgModule).subscribe(
                (module) => {
                    this.onChildSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/modules/${this.nsgModule.name}`], {fragment: 'info'})
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        }
    }

    onFormEdit(form) {
        if (form.valid && !form.submitted) {
            this.onChildEdited.emit(this.nsgModule);
        }
    }
}
