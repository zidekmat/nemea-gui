import {NsgModule} from "./nsg-module";
import {NsgInterface} from "./nsg-interface";

export class NsgInstance {
    name : string;
    nsgModule : Object<NsgModule>;
    nsgInterfaces : Object<NsgInterface>[];
}