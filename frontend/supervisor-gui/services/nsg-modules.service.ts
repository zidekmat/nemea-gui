import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NsgInstance } from "../models/nsg-instance";
import { NsgModule } from "../models/nsg-module";
import { NsgModule2 } from "../models/nsg-module2";
import { of } from 'rxjs/observable/of';

@Injectable()
export class NsgModulesService {

    constructor(private http: Http) {}

    getAllModules() : Observable<NsgModule2[]> {
        return this.http.get('/nemea/sg/modules?withInstances=false')
            .map(response => response.json() as NsgModule2[]);
    }

    getModule(moduleName: string): Observable<NsgModule2> {
        return this.http.get(`/nemea/sg/modules/${moduleName}`)
            .map(response => response.json() as NsgModule2);
    }

    createModule(mod: NsgModule2): Observable<{}> {
        return this.http.post(`/nemea/sg/modules`, mod);
    }

    updateModule(moduleOrigName: string, mod: NsgModule2): Observable<{}> {
        return this.http.put(
            `/nemea/sg/modules/${moduleOrigName}`,
            mod
        );
    }

    removeModule(moduleName: string) : Observable<{}> {
        return this.http.delete(`/nemea/sg/modules/${moduleName}`);
    }


/*
    private handleError(err: Response | any) {
        return Promise.reject(err);
    }
*/

/*    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`
            );
        }
        // return an ErrorObservable with a user-facing error message
/!*        return new ErrorObservable(
            'Something bad happened; please try again later.'
        );*!/
        return "TODO";
    };*/

/*    private handleError(error: HttpErrorResponse) {
        console.log(error);
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
            'Something bad happened; please try again later.');
    };*/

}
