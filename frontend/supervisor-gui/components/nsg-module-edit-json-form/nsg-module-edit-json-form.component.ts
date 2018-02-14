import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {NsgModule2} from "../../models/nsg-module2";
import {NsgYangService} from "../../pages/nsg-yang.service";
import {NsgYangModel} from "../../models/nsg-yang-model";

@Component({
    selector: 'nsg-module-edit-xml-form',
    templateUrl: './nsg-module-edit-xml-form.component.html',
    styleUrls: ['./nsg-module-edit-xml-form.component.scss']
    providers: [NsgYangService]
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

    yangModel: NsgYangModel;
    nsgModuleXml: string;
    backendErrors: any[];

    constructor(private nsgYangService: NsgYangService) {
        this.backendErrors = [];
    }

    ngOnInit() {
        this.nsgYangService.getModelForXpath("").subscribe(
            (model) => {
                this.yangModel = model;
            },
            (error) => {
                console.log(error);
                // TODO onError
            }
        );
        this.nsgModuleXml = "<?xml";
    }

    insertFromFile($event: any) {
        let reader = new FileReader();
        myReader.onloadend = (e) => {
            this.nsgModuleXml = reader.result;
            // send to validate
        };

        var self = this;
        var file = $event.target.files[0];
        myReader.readAsText(file);
        var resultSet = [];
        myReader.onloadend = function(e){
            // you can perform an action with data read here
            // as an example i am just splitting strings by spaces
            var columns = myReader.result.split(/\r\n|\r|\n/g);

            for (var i = 0; i < columns.length; i++) {
                resultSet.push(columns[i].split(' '));
            }

            self.resultSet=resultSet; // probably dont need to do this atall
            self.complete.next(self.resultSet); // pass along the data which would be used by the parent component
        };
    }

    resetForm() {

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
}
