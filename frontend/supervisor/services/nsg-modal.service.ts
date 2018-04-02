import {Injectable} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class NsgModal {

    modalRef : any;

    constructor(private modalService: NgbModal) {
    }

    openNsgModal(content) {
        console.log('content:');
        console.log(content);
        this.modalRef = this.modalService.open(content);
        console.log('modalref');
        console.log(this.modalRef);
        /* This is nasty trick to display the modal vertically centered since bootstrap-ng
         * doesn't seem to support adding class .modal-dialog-centered.
         * See https://stackoverflow.com/questions/48426249/how-to-vertically-center-modal-dialog-using-ng-modal/48704628#48704628
         * for updates */
        this.modalRef._windowCmptRef._component._elRef.nativeElement.style = 'display: block; padding-top: 20%';
    }

    closeNsgModal() {
        this.modalRef.close();
    }
}
