import {NsgModule2} from "./nsg-module2";
import {NsgInterface2} from "./nsg-interface2";

export interface NsgInstance2 {
    name: string;
    module: NsgModule2;
    running: boolean;
    enabled: boolean;
    in_ifces: object[];
    out_ifces: object[];

    tcp_params?: object;
    tcp_tls_params?: object;
    unix_params?: object;
    file_params?: object;
}