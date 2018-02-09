import {NsgInstance} from "./nsg-instance";

export class NsgModule {
    name: string;
    nsgInstances: NsgInstance[];
    is_nemea_mod: boolean;
    is_sr_ready: boolean;
    sr_cb_ready: boolean;
    path: string;
    description: string;
    in_ifces_cnt: string;
    out_ifces_cnt: string;


    constructor(fields : any) {
        if (Object.keys(fields).length === 0) {
            this.is_nemea_mod = false;
            this.is_sr_ready = false;
            this.sr_cb_ready = false;
            this.in_ifces_cnt = '0';
            this.out_ifces_cnt = '0';
        } else {
            Object.assign(this, fields);
        }
    }
}