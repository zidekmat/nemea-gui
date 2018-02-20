import { Component, OnInit, ViewChild } from '@angular/core';
import {NsgInstanceEditPlainFormComponent} from "../shared/nsg-edit/plain/instance/nsg-instance-edit-plain-form.component";
import {NsgInstanceEditJsonFormComponent} from "../shared/nsg-edit/json/instance/nsg-instance-edit-json-form.component";
import {NsgInstance} from "../../models/nsg-instance";

@Component({
  selector: 'nsg-instance-new',
  templateUrl: './nsg-instance-new.component.html',
  styleUrls: ['./nsg-instance-new.component.scss']
})
export class NsgInstancesNewComponent implements OnInit {
    @ViewChild(NsgInstanceEditPlainFormComponent)
    private plainFormComponent: NsgInstanceEditPlainFormComponent;
    @ViewChild(NsgInstanceEditJsonFormComponent)
    private jsonFormComponent: NsgInstanceEditJsonFormComponent;

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
        this.plainFormComponent.nsgInstance = inst;
        this.plainFormComponent.fetchModule();
        this.jsonFormComponent.nsgInstanceJson = inst.apiJson();
        this.jsonFormComponent.beautifyJson();
    }
}
