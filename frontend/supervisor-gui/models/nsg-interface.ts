import {NsgInstance} from "./nsg-instance";

export class NsgInterface {
    name : string;
    nsgInstance : NsgInstance;

    constructor(fields : Object) {
        Object.assign(this, fields);
    }
}