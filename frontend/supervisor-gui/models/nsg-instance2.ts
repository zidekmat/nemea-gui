import {NsgModule2} from "./nsg-module2";
import {NsgInterface2} from "./nsg-interface2";

export interface NsgInstance2 {
    name : string;
    nsgModule : NsgModule2;
    nsgInterfaces : NsgInterface2[];

    running : boolean;
    enabled : boolean;
    in_ifces_cnt : string;
    out_ifces_cnt : string;
}