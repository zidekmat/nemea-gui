import { Component, OnInit, ViewChild } from '@angular/core';
import {NsgInstanceEditComponent} from "../nsg-instance-edit/nsg-instance-edit.component"
import {NsgInstance} from "../../models/nsg-instance";

@Component({
  selector: 'nsg-instance-new',
  templateUrl: './nsg-instance-new.component.html',
  styleUrls: ['./nsg-instance-new.component.scss']
})
export class NsgInstancesNewComponent implements OnInit {
    @ViewChild(NsgInstanceEditComponent)
    private editForm: NsgInstanceEditComponent;

    nsgInstance: NsgInstance;
    instanceNotFound = false;

    constructor() {
        this.nsgInstance = NsgInstance.newFromDefaults();
    }

    ngOnInit() {
    }

    /* This is information from one of children forms that instance
     * was edited with values passed in `inst`. */
    onChildEdited(inst: NsgInstance) {
        console.log('onEdited in new');
        console.log(inst);
        this.nsgInstance = inst;

        // Edit working values of both forms
        this.editForm.nsgInstance = inst;
        this.editForm.fetchModule();
    }
}
