import {NsgInstance2} from "./nsg-instance2";

export interface NsgModule2 {
    name: string;
    nsgInstances?: NsgInstance2[];
    is_nemea_mod?: boolean;
    is_sr_ready?: boolean;
    sr_cb_ready?: boolean;
    path?: string;
    description?: string;
    in_ifces_cnt?: string;
    out_ifces_cnt?: string;
}