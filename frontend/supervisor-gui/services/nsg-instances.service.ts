import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NsgInstance} from "../models/nsg-instance";
import {NsgModule} from "../models/nsg-module";
import {NsgInterface} from "../models/nsg-interface";

@Injectable()
export class NsgInstancesService {
    constructor(private http: Http) {
    }

    getAllInstances(): Observable<NsgInstance[]> {
        return this.http.get('/nemea/sg/instances')
            .map(response => response.json().map(
                obj => NsgInstance.newFromApi(obj)
            ));
    }

    getAllInstancesNames(): Observable<string[]> {
        return this.http.get('/nemea/sg/instances')
            .map(response => {
                return response.json().map(x => x.name);
            });
    }

    getAllInstancesByModuleName(moduleName: string): Observable<NsgInstance[]> {
        // TODO rather make endpoint? see how it performs
        return this.http.get('/nemea/sg/instances')
            .map(response => response.json().filter(
                obj => obj.module_kind == moduleName
            ).map(i => new NsgInstance(i)));
    }

    createInstance(inst: NsgInstance): Observable<{}> {
        return this.http.post(`/nemea/sg/instances`, inst.apiJson());
    }

    getInstance(instName: string): Observable<NsgInstance> {
        return this.http.get(`/nemea/sg/instances/${instName}`)
            .map(resp => NsgInstance.newFromApi(resp.json()));
    }

    updateInstance(instOrigName: string, inst: NsgInstance): Observable<{}> {
        return this.http.put(
            `/nemea/sg/instances/${instOrigName}`,
            inst.apiJson()
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

    getInterface(instName: string, ifcName: string): Observable<NsgInterface> {
        return this.http.get(`/nemea/sg/instances/${instName}/ifces/${ifcName}`)
            .map(response => new NsgInterface(response.json()));
    }

    getAllInterfacesNames(instName: string): Observable<string[]> {
        return this.http.get(`/nemea/sg/instances/${instName}/ifces?only=name`)
            .map(response => response.json() as string[]);
    }

    addInterface(instanceName: string, ifc: NsgInterface): Observable<{}> {
        return this.http.post(
            `/nemea/sg/instances/${instanceName}/ifces`,
            ifc
        );
    }

    updateInterface(instanceName: string, origIfcName: string, ifc: NsgInterface): Observable<{}> {
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
