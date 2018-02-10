import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {NsgModule2} from "../../models/nsg-module2";

@Component({
  selector: 'nsg-module-edit-xml-form',
  templateUrl: './nsg-module-edit-xml-form.component.html',
  styleUrls: ['./nsg-module-edit-xml-form.component.scss']
})
export class NsgModuleEditXmlFormComponent implements OnInit {

    /**
     * Module to be changed
     */
    @Input() passedModule: NsgModule2;

    /**
     * After edit this emitter passes changed module object
     */
    @Output() onEdited = new EventEmitter<NsgModule2>();

  constructor() { }

  ngOnInit() {
  }

}
