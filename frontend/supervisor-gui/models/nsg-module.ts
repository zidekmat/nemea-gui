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

    public assign(module: NsgModule) {
        console.log('pico');
        this.name = module.name;
        this.nsgInstances = module.nsgInstances;
        this.is_nemea_mod = module.is_nemea_mod;
        this.is_sr_ready = module.is_sr_ready;
        this.sr_cb_ready = module.sr_cb_ready;
        this.path = module.path;
        this.description = module.description;
        this.in_ifces_cnt = module.in_ifces_cnt;
        this.out_ifces_cnt = module.out_ifces_cnt;
    }
}