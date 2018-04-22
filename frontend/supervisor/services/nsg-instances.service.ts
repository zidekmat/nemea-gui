import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NsgInstance} from "../models/nsg-instance";
import {NsgInstanceStats} from "../models/nsg-instance-stats";
import {NsgInterface} from "../models/nsg-interface";

@Injectable()
export class NsgInstancesService {
    constructor(private http: Http) {
    }

    getAllInstances(): Observable<NsgInstance[]> {
        return this.http.get('/nemea/instances')
            .map(response => {
                return response.json().map(
                    obj => NsgInstance.newFromApi(obj)
                )}
            );
    }

    getAllInstancesNames(): Observable<string[]> {
        return this.http.get('/nemea/instances')
            .map(response => {
                return response.json().map(x => x.name);
            });
    }

    getAllInstancesByModuleName(moduleName: string): Observable<NsgInstance[]> {
        return this.http.get(`/nemea/modules/${moduleName}/instances`)
            .map(resp => resp.json().map(x => NsgInstance.newFromApi(x)));
    }

    createInstance(inst: NsgInstance): Observable<{}> {
        return this.http.post(`/nemea/instances`, inst.apiJson());
    }

    getInstance(instName: string): Observable<NsgInstance> {
        return this.http.get(`/nemea/instances/${instName}`)
            .map(resp => NsgInstance.newFromApi(resp.json()));
    }

    updateInstance(instOrigName: string, inst: NsgInstance): Observable<{}> {
        return this.http.put(
            `/nemea/instances/${instOrigName}`,
            inst.apiJson()
        );
    }

    removeInstance(instanceName: string): Observable<{}> {
        return this.http.delete(`/nemea/instances/${instanceName}`);
    }


    startInstance(instanceName: string): Observable<{}> {
        return this.http.post(`/nemea/instances/${instanceName}/start`,{});
    }

    stopInstance(instanceName: string): Observable<{}> {
        return this.http.post(`/nemea/instances/${instanceName}/stop`, {});
    }

    restartInstance(instanceName: string): Observable<{}> {
        return this.http.post(`/nemea/instances/${instanceName}/stop`, {})
            .flatMap(() => {
                return this.http.post(`/nemea/instances/${instanceName}/start`, {});
            });
    }

    getInterface(instName: string, ifcName: string): Observable<NsgInterface> {
        return this.http.get(`/nemea/instances/${instName}`)
            .map(function (response) {
                    let ifces = response.json()['interface'];
                    for (let i = 0; i < ifces.length; i++) {
                        if (ifces[i]['name'] == ifcName) {
                            return new NsgInterface(ifces[i]);
                        }
                    }
                    return null;
                }
            );
    }

    getInstanceStats(instanceName: string): Observable<NsgInstanceStats> {
        return this.http.get(`/nemea/instances/${instanceName}/stats`).map(
            response => NsgInstanceStats.newFromApi(response.json()['stats'])
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
