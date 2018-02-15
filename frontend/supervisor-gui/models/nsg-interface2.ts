import {NsgInstance2} from "./nsg-instance2";

export interface NsgInterface2 {
    name : string;
    nsgInstance : NsgInstance2;
    direction: string;
    type: string;

    buffer?: string;
    autoflush?: string;
    timeout?: string;

    tcp_params?: NsgIfcTcpParams;
    tcp_tls_params?: NsgIfcTcpTlsParams;
    unix_params?: NsgIfcUnixParams;
    file_params?: NsgIfcFileParams;
}

interface NsgIfcTcpParams {
    host?: string;
    port: string;
    max_clients?: number;
}

interface NsgIfcTcpTlsParams {
    host?: string;
    port: string;
    max_clients?: number;
    keyfile: string;
    cafile: string;
    certfile: string;
}

interface NsgIfcUnixParams {
    socket_name: string;
    max_clients?: number;
}

interface NsgIfcFileParams {
    name: string;
    time?: number;
    size?: number;
    mode?: string;
}