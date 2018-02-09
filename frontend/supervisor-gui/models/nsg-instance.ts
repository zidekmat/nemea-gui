import {NsgModule} from "./nsg-module";
import {NsgInterface} from "./nsg-interface";

export class NsgInstance {
    name : string;
    nsgModule : NsgModule;
    nsgInterfaces : NsgInterface[];

    running : boolean;
    enabled : boolean;
    in_ifces_cnt : string;
    out_ifces_cnt : string;


    constructor(fields : any) {
        // noinspection Annotator
        Object.assign(this, fields);
    }

    tableStatus() {
        return (this.running ? '' : 'not ') + 'running & ' + (this.enabled ? 'enabled' : 'disabled');
    }

    tableIfcesCnt() {
        return this.in_ifces_cnt + '/' + this.out_ifces_cnt;
    }
}