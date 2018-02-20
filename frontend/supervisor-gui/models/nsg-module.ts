export class NsgModule {
    name: string;
    is_nemea_mod: boolean;
    is_sr_ready: boolean;
    sr_cb_ready: boolean;
    path: string;
    description: string;
    in_ifces_cnt: string;
    out_ifces_cnt: string;

    constructor(fields: any) {
        Object.assign(this, fields);
    }

    static newFromDefaults() {
        return new NsgModule({
            name: '',
            is_nemea_mod: false,
            is_sr_ready: false,
            sr_cb_ready: false,
            in_ifces_cnt: '0',
            out_ifces_cnt: '0',
            nsgInstances: []
        });
    }

    apiJson(): string {
        return JSON.stringify({
            name: this.name,
            is_nemea_mod: this.is_nemea_mod,
            is_sr_ready: this.is_sr_ready,
            sr_cb_ready: this.sr_cb_ready,
            path: this.path,
            description: this.description,
            in_ifces_cnt: this.in_ifces_cnt,
            out_ifces_cnt: this.out_ifces_cnt,
        });
    }

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        return new NsgModule(obj);
    }
}