import {NsgModule2} from "./nsg-module2";
import {NsgInterface2} from "./nsg-interface2";

export interface NsgInstance2 {
    name: string;
    module: NsgModule2;
    running: boolean;
    enabled: boolean;
    use_sysrepo: boolean;
    max_restarts_per_min: number;
    params?: string;
    sysrepo_xpath?: string;
    in_ifces: NsgInterface2[];
    out_ifces: NsgInterface2[];
}