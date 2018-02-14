import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NsgInstance } from "../models/nsg-instance";
import { NsgModule } from "../models/nsg-module";
import {NsgInstance2} from "../models/nsg-instance2";

@Injectable()
export class NsgInstancesService {

    MODULES = [
        new NsgModule({
            name: 'Module 1',
            nsgInstances: [],
            is_nemea_mod: false,
            is_sr_ready: false,
            sr_cb_ready: false,
            path: "/a/b/c/d",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        })
    ];

    constructor(private http: Http) {}


    remove(instanceName: string) : Observable<{}> {
        return this.http.delete(`/nemea/sg/instances/${instanceName}`);
    }

    getAll() : Observable<NsgInstance2[]> {
        return this.http.get('/nemea/sg/instances')
            .map(response => response.json() as NsgInstance2[]);
    }

    start(instanceName: string) : Observable<{}> {
        const cmd = {command: 'start'};
        return this.http.post(`/nemea/sg/instances/${instanceName}/control`, cmd);
    }
    stop(instanceName: string) : Observable<{}> {
        const cmd = {command: 'stop'};
        return this.http.post(`/nemea/sg/instances/${instanceName}/control`, cmd);
    }
    restart(instanceName: string) : Observable<{}> {
        const cmd = {command: 'restart'};
        return this.http.post(`/nemea/sg/instances/${instanceName}/control`, cmd);
    }








    getAllInstances() : Object[] {
      return [
          this.mockInstance("IPFIXCOL 1"),
          this.mockInstance("IPFIXSEND 1"),
          this.mockInstance("reporter 1"),
          this.mockInstance("reporter 2"),
          this.mockInstance("reporter 3"),
          this.mockInstance("reporter 4"),
          this.mockInstance("reporter 5"),
          this.mockInstance("reporter 6"),
          this.mockInstance("reporter 7"),
          this.mockInstance("reporter 8"),
      ];
    }

    private handleError(err: Response | any) {
        return Promise.reject(err);
    }

    private mockInstance(name: string) : NsgInstance {
        const module = new NsgModule({
            name: name.substring(0, name.length-2)
        });

        return new NsgInstance({
            name: name,
            running: Math.random() > 0.5,
            enabled: Math.random() > 0.5,
            in_ifces_cnt: this.randomNumberStr(),
            out_ifces_cnt: this.randomNumberStr(),
            nsgModule: module
        });
    }

    private randomNumberStr() : string {
        return (Math.floor(Math.random() * 20) + 1).toString();
    }
}
