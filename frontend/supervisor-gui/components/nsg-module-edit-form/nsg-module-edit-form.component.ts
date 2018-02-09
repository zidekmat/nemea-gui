import {Component, OnInit, Input} from '@angular/core';
import {NsgModule} from "../../models/nsg-module";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {NsgModulesService} from "../../pages/nsg-modules.service";

@Component({
    selector: 'nsg-module-edit-form',
    templateUrl: './nsg-module-edit-form.component.html',
    styleUrls: ['./nsg-module-edit-form.component.scss']
})
export class NsgModuleEditFormComponent implements OnInit {


    @Input() nsgModule: NsgModule;
    originalNsgModule: NsgModule;
    prefillFromModule: string;
    backendErrors: [];

    /**
     * indicates whether this component is used for editing existing module
     *  or as form for creating new one
     */
    isEditForm: boolean;

    constructor(private modalService: NgbModal,
                private nsgModulesService: NsgModulesService,
                private router: Router) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.isEditForm = true;
        this.originalNsgModule = JSON.parse(JSON.stringify(this.nsgModule));
        /*    if (this.nsgModule == undefined) {
              this.nsgModule = new NsgModule({});
            }*/
    }

    toggleBool(modelAttribute: string, event) {
        let target = event.target || event.srcElement || event.currentTarget;
        if (target.value == 'false') {
            target.value = 'true';
        } else {
            target.value = 'false';
        }

        this.nsgModule[modelAttribute] = target.value == 'true';
    }

    resetForm() {
        this.nsgModule = JSON.parse(JSON.stringify(this.originalNsgModule));
    }

    openModal(content) {
        this.prefillModal = this.modalService.open(content);
        /* This is nasty trick display the modal vertically centered since bootstrap-ng
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
                // TODO onError
            }
        );
    }

    onSubmit() {
        const router = this.router;
        if (this.isEditForm) {
            this.nsgModulesService.updateModule(this.originalNsgModule.name, this.nsgModule).subscribe(
                (module) => {
                    console.log('jupiiii');
                    router.navigate([`/nemea/supervisor-gui/module/${this.nsgModule.name}`])
                    // TODO onError
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        } else {
            this.nsgModulesService.createModule(this.nsgModule).subscribe(
                (module) => {
                    console.log('jupiiii');
                    router.navigate([`/nemea/supervisor-gui/module/${this.nsgModule.name}`])
                    // TODO onError
                },
                (error) => {
                    console.log(error);
                    this.backendErrors = error.json();
                }
            );
        }
    }

}
