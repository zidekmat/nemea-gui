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

    apiJson(): string {
        return JSON.stringify(
            {
                name: this.name,
                'module-ref': this.nsgModule.name,
                enabled: this.enabled,
                "use-sysrepo": this.use_sysrepo,
                max_restarts_per_min: this.max_restarts_per_min,
                params: this.params,
                'interface': this.in_ifces.concat(this.out_ifces)
            }
        );
    }

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        obj['nsgModule'] = new NsgModule({
            name: obj['module-ref']
        });
        obj['in_ifces'] = [];
        obj['out_ifces'] = [];

        for (let i = 0; i < obj['interface']; i++) {
            if (obj['interface'][i].direction == 'IN') {
                obj['in_ifces'].push(new NsgInterface(obj['interface'][i]));
            } else {
                obj['out_ifces'].push(new NsgInterface(obj['interface'][i]));
            }
        }
        delete obj['module-ref'];
        delete obj['interface'];

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
}