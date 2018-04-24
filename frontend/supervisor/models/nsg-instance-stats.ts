export class NsgInstanceStats {
    running: boolean;
    restart_counter: number;
    cpu_user: number;
    cpu_kern: number;
    mem_vms: number;
    mem_rss: number;

    constructor(fields = {}) {
        Object.assign(this, fields);
    }

    static newFromApi(obj) {
        if (obj.constructor.name === 'String') {
            obj = JSON.parse(obj);
        }

        const keys = ['restart-counter', 'cpu-user', 'cpu-kern', 'mem-vms', 'mem-rss'];
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] in obj) {
                console.log(keys[i])
                obj[keys[i].replace(/-/g, '_')] = obj[keys[i]];
                delete obj[keys[i]];
            }
        }

        return new NsgInstanceStats(obj);
    }
}