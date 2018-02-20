import {NsgModule} from "./nsg-module";
import {NsgInterface} from "./nsg-interface";

export class NsgInstance {
    name: string;
    nsgModule: NsgModule;
    running: boolean;
    enabled: boolean;
    use_sysrepo: boolean;
    max_restarts_per_min: number;
    params?: string;
    sysrepo_xpath?: string;

    in_ifces: NsgInterface[];
    out_ifces: NsgInterface[];

    inIfcesTodo: number;
    outIfcesTodo: number;
    totalIfcesTodo: number;


    constructor(fields: any) {
        Object.assign(this, fields);
        //this.nsgModule = fields.module;
    }

    countIfcesTodo() {
        if (!this.nsgModule.in_ifces_cnt || !this.nsgModule.in_ifces_cnt) {
            return;
        }

        let sum: number;
        if (this.nsgModule.in_ifces_cnt == '*') {
            this.inIfcesTodo = 0;
        } else {
            sum = parseInt(this.nsgModule.in_ifces_cnt) - this.in_ifces.length;
            if (sum > 0) {
                this.inIfcesTodo = sum;
            } else {
                this.inIfcesTodo = 0;
            }
        }

        if (this.nsgModule.out_ifces_cnt == '*') {
            this.outIfcesTodo = 0;
        } else {
            sum = parseInt(this.nsgModule.out_ifces_cnt) - this.out_ifces.length;
            if (sum > 0) {
                this.outIfcesTodo = sum;
            } else {
                this.outIfcesTodo = 0;
            }
        }
        this.totalIfcesTodo = this.inIfcesTodo + this.outIfcesTodo;

    }

    addIfc(ifc: NsgInterface) {
        if (ifc.direction == 'IN') {
            this.in_ifces.push(ifc);
            if (this.inIfcesTodo > 0) {
                this.inIfcesTodo--;
                this.totalIfcesTodo--;
            }
        } else {
            this.out_ifces.push(ifc);
            if (this.outIfcesTodo > 0) {
                this.outIfcesTodo--;
                this.totalIfcesTodo--;
            }
        }
    }

    removeIfc(ifc: NsgInterface) {
        let ifces = ifc.direction == 'IN' ? this.in_ifces : this.out_ifces;
        for (let i = 0; i < ifces.length; i++) {
            if (ifc.name == ifces[i].name) {
                ifces.splice(i, 1);

                if (ifc.direction == 'IN' && this.nsgModule.in_ifces_cnt != '*') {
                    this.inIfcesTodo++;
                    this.totalIfcesTodo++;
                } else if (ifc.direction == 'OUT' && this.nsgModule.out_ifces_cnt != '*') {
                    this.outIfcesTodo++;
                    this.totalIfcesTodo++;
                }

                return;
            }
        }
    }

    /*
        asSrJson(): string {
            return JSON.stringify({
                "nemea:supervisor": {
                    "module": [
                        {
                            name: this.name,
                            module_kind: this.nsgModule.name,
                            enabled: this.enabled,
                            use_sysrepo: this.use_sysrepo,
                            max_restarts_per_min: this.max_restarts_per_min,
                            params: this.params,
                            sysrepo_xpath: this.sysrepo_xpath,
                            in_ifces: this.in_ifces,
                            out_ifces: this.out_ifces,
                        }
                    ]
                }
            });
        }*/

    apiJson(): string {
        return JSON.stringify(
            {
                name: this.name,
                module_kind: this.nsgModule.name,
                enabled: this.enabled,
                use_sysrepo: this.use_sysrepo,
                max_restarts_per_min: this.max_restarts_per_min,
                params: this.params,
                sysrepo_xpath: this.sysrepo_xpath,
                in_ifces: this.in_ifces,
                out_ifces: this.out_ifces,
            }
        );
    }

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        obj['nsgModule'] = new NsgModule({
            name: obj.module_kind
        });
        delete obj.module_kind;

        obj['in_ifces'] = obj['in_ifces'].map(i => new NsgInterface(i));
        obj['out_ifces'] = obj['out_ifces'].map(i => new NsgInterface(i));

        return new NsgInstance(obj);
    }

    static newFromDefaults() {
        return new NsgInstance({
            name: '',
            nsgModule: new NsgModule({}),
            running: false,
            enabled: true,
            use_sysrepo: false,
            max_restarts_per_min: 3,
            params: '',
            in_ifces: [],
            out_ifces: [],
        });
    }

    /*
        static newFromApiJson(json: string) {
            return this.newFromApi(JSON.parse(json));
        }

        static newFromSrJson(json: string) {
            let obj = JSON.parse(json)['nemea:supervisor']['module'][0];
            return this.newFromApiJson(obj.toString());
        }*/
}