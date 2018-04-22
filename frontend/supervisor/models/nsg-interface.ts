import {NsgInstance} from "./nsg-instance";

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

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        const params = ['tcp-params', 'tcp-tls-param', 'unix-params', 'file-params'];
        for (let i = 0; i < params.length; i++) {
            if (params[i] in obj) {
                obj[params[i].replace(/-/g, '_')] = NsgInterface.underscorize(obj[params[i]]);
                delete obj[params[i]];
            }
        }

        return new NsgInterface(obj);
    }

    apiJsonObj(): Object {
        let obj = {
                name: this.name,
                direction: this.direction,
                type: this.type,
                buffer: this.buffer,
                autoflush: this.autoflush,
                timeout: this.timeout,
        };

        switch (this.type) {
            case 'TCP':
                obj['tcp-params'] = NsgInterface.dasherize(this.tcp_params);
                break;
            case 'TCP-TLS':
                obj['tcp-tls-params'] = NsgInterface.dasherize(this.tcp_tls_params);
                break;
            case 'UNIXSOCKET':
                obj['unix-params'] = NsgInterface.dasherize(this.unix_params);
                break;
            case 'FILE':
                obj['file-params'] = NsgInterface.dasherize(this.file_params);
                break;
        }

        return obj;
    }

    static dasherize(obj) {
        let keys = Object.keys(obj).filter((k) => k.includes('_'));
        for (let i = 0; i < keys.length; i++) {
            let new_key = keys[i].replace(/_/g, '-');
            obj[new_key] = obj[keys[i]];
            delete obj[keys[i]];
        }

        return obj;
    }

    static underscorize(obj) {
        let keys = Object.keys(obj).filter((k) => k.includes('-'));
        for (let i = 0; i < keys.length; i++) {
            let new_key = keys[i].replace(/-/g, '_');
            obj[new_key] = obj[keys[i]];
            delete obj[keys[i]];
        }

        return obj;
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