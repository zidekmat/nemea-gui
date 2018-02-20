import {NsgInstance} from "./nsg-instance";
import {NsgInstance2} from "./nsg-instance2";

export class NsgInterface {

    static types = ['TCP', 'TCP-TLS', 'UNIXSOCKET', 'FILE', 'BLACKHOLE'];
    static directions = ['IN', 'OUT'];

    name: string;
    nsgInstance: NsgInstance;
    direction: string;
    type: string;

    buffer: string;
    autoflush: string;
    timeout: string;

    tcp_params: NsgIfcTcpParams;
    tcp_tls_params: NsgIfcTcpTlsParams;
    unix_params: NsgIfcUnixParams;
    file_params: NsgIfcFileParams;

    constructor(fields = {}) {
        Object.assign(this, fields);

        if (!this.tcp_params) {
            this.tcp_params = {};
        }
        if (!this.tcp_tls_params) {
            this.tcp_tls_params = {}
        }
        if (!this.unix_params) {
            this.unix_params = {}
        }
        if (!this.file_params) {
            this.file_params = {}
        }
    }

    static newFromInstance(inst: NsgInstance) {
        const fields = {type: 'UNIXSOCKET'};
        if (inst.inIfcesTodo > 0) {
            fields['name'] = 'in' + inst.in_ifces.length.toString();
            fields['direction'] = 'IN';
        } else {
            fields['name'] = 'out' + inst.out_ifces.length.toString();
            fields['direction'] = 'OUT';
        }
        let sockNameRA = /[\w0-9 ]+/.exec(inst.name);
        let sockName: string;
        if (sockNameRA.length > 0) {
            sockName = sockNameRA[0].replace(/ /g, '_');
            sockName = sockName+'_'+fields['name'];
        } else {
            sockName = fields['name'];
        }

        fields['unix_params'] = { socket_name: sockName };

        return new this(fields);
    }

    generateNameFromInstance(inst: NsgInstance) {
        if (inst.inIfcesTodo > 0) {
            this.name = 'in' + inst.in_ifces.length.toString();
            this.direction = 'IN';
        } else {
            this.name = 'out' + inst.out_ifces.length.toString();
            this.direction = 'OUT';
        }
    }

}

interface NsgIfcTcpParams {
    host?: string;
    port?: string;
    max_clients?: number;
}

interface NsgIfcTcpTlsParams {
    host?: string;
    port?: string;
    max_clients?: number;
    keyfile?: string;
    cafile?: string;
    certfile?: string;
}

interface NsgIfcUnixParams {
    socket_name?: string;
    max_clients?: number;
}

interface NsgIfcFileParams {
    name?: string;
    time?: number;
    size?: number;
    mode?: string;
}