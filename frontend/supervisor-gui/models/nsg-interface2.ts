import {NsgInstance2} from "./nsg-instance2";

export interface NsgInterface2 {
    name : string;
    nsgInstance : NsgInstance2;
    direction: string;
    type: string;

    buffer?: string;
    autoflush?: string;
    timeout?: string;

    tcp_params?: object;
    tcp_tls_params?: object;
    unix_params?: object;
    file_params?: object;
}