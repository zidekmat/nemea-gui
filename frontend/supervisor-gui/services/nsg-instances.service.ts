import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NsgInstance} from "../models/nsg-instance";
import {NsgModule} from "../models/nsg-module";
import {NsgInstance2} from "../models/nsg-instance2";
import {NsgInterface2} from "../models/nsg-interface2";

@Injectable()
export class NsgInstancesService {
    constructor(private http: Http) {
    }

    getAllInstances(): Observable<NsgInstance2[]> {
        return this.http.get('/nemea/sg/instances')
            .map(response => response.json() as NsgInstance2[]);
    }

    // TODO get all just names, rename also in module

    createInstance(inst: NsgInstance2): Observable<{}> {
        return this.http.post(`/nemea/sg/instances`, inst);
    }

    getInstance(instName: string): Observable<NsgInstance2> {
        return this.http.get(`/nemea/sg/instances/${instName}`)
            .map(response => response.json() as NsgInstance2);
    }

    updateInstance(instOrigName: string, inst: NsgInstance2): Observable<{}> {
        return this.http.put(
            `/nemea/sg/instances/${instOrigName}`,
            inst
        );
    }

    removeInstance(instanceName: string): Observable<{}> {
        return this.http.delete(`/nemea/sg/instances/${instanceName}`);
    }


    startInstance(instanceName: string): Observable<{}> {
        const cmd = {command: 'start'};
        return this.http.post(
            `/nemea/sg/instances/${instanceName}/control`,
            cmd
        );
    }

    stopInstance(instanceName: string): Observable<{}> {
        const cmd = {command: 'stop'};
        return this.http.post(
            `/nemea/sg/instances/${instanceName}/control`,
            cmd
        );
    }

    restartInstance(instanceName: string): Observable<{}> {
        const cmd = {command: 'restart'};
        return this.http.post(
            `/nemea/sg/instances/${instanceName}/control`,
            cmd
        );
    }

    addInterface(instanceName: string, ifc: NsgInterface2): Observable<{}> {
        return this.http.post(
            `/nemea/sg/instances/${instanceName}/ifces`,
            ifc
        );
    }

    updateInterface(instanceName: string, origIfcName: string, ifc: NsgInterface2): Observable<{}> {
        return this.http.put(
            `/nemea/sg/instances/${instanceName}/ifces/${origIfcName}`,
            ifc
        );
    }

    removeInterface(instName: string, ifcName: string): Observable<{}> {
        return this.http.delete(
            `/nemea/sg/instances/${instName}/ifces/${ifcName}`
        );
    }

    private handleError(err: Response | any) {
        return Promise.reject(err);
    }

    private errorLogger(error: any) {
        console.log('Service error:');
        console.log(error);
        //throw
    }
}
