import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NsgModule2} from "../../models/nsg-module2";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {NsgModulesService} from "../../pages/nsg-modules.service";

@Component({
    selector: 'nsg-module-edit-plain-form',
    templateUrl: './nsg-module-edit-plain-form.component.html',
    styleUrls: ['./nsg-module-edit-plain-form.component.scss']
})
export class NsgModuleEditPlainFormComponent implements OnInit {


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

    nsgModule: NsgModule2; // NsgModule model that is currently edited
    prefillFromModule: string;
    backendErrors: any[];
    prefillModal: any;
    nsgModulesList: NsgModule2[];

    constructor(private modalService: NgbModal,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.resetForm();
        this.nsgModulesService.getAllModules().subscribe(
            (nsgModules) => {
                this.nsgModulesList = nsgModules;
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

    openModal(content) {
        this.prefillModal = this.modalService.open(content);
        /* This is nasty trick to display the modal vertically centered since bootstrap-ng
         * doesn't seem to support adding class .modal-dialog-centered.
         * See https://stackoverflow.com/questions/48426249/how-to-vertically-center-modal-dialog-using-ng-modal/48704628#48704628
         * for updates */
        this.prefillModal._windowCmptRef._component._elRef.nativeElement.style = 'display: block; padding-top: 20%';
    }

    prefill() {
        this.nsgModulesService.getModule(this.prefillFromModule).subscribe(
            (module) => {
                this.nsgModule = module;
                this.prefillModal.close()
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
                    this.onSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/module/${this.nsgModule.name}`], {fragment: 'info'})
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        } else {
            this.nsgModulesService.createModule(this.nsgModule).subscribe(
                (module) => {
                    this.onSaved.emit(this.nsgModule);
                    this.router.navigate([`/nemea/supervisor-gui/module/${this.nsgModule.name}`], {fragment: 'info'})
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
            this.onEdited.emit(this.nsgModule);
        }
    }
}
