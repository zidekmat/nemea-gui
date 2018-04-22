import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NsgInstance } from "../models/nsg-instance";
import { NsgModule } from "../models/nsg-module";
import { of } from 'rxjs/observable/of';

@Injectable()
export class NsgModulesService {

    constructor(private http: Http) {}

    getAllModules() : Observable<NsgModule[]> {
        return this.http.get('/nemea/modules')
            .map(response => response.json().map(m => NsgModule.newFromApi(m)));
    }

    getAllModulesNames(): Observable<string[]> {
        return this.http.get('/nemea/modules')
            .map(response => {
                return response.json().map(m => m.name);
            });
    }

    getModule(moduleName: string): Observable<NsgModule> {
        return this.http.get(`/nemea/modules/${moduleName}`)
            .map(response => NsgModule.newFromApi(response.json()));
    }

    createModule(mod: NsgModule): Observable<{}> {
        return this.http.post(`/nemea/modules`, mod.apiJson());
    }

    updateModule(moduleOrigName: string, mod: NsgModule): Observable<{}> {
        return this.http.put(
            `/nemea/modules/${moduleOrigName}`,
            mod.apiJson()
        );
    }

    removeModule(moduleName: string) : Observable<{}> {
        return this.http.delete(`/nemea/modules/${moduleName}`);
    }
}
