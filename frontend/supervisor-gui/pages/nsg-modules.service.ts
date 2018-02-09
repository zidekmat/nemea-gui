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
      return of([
          new NsgModule({name: "IPFIXCOL", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "IPFIXSEND", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "vportscan_detector", is_nemea_mod: true, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "link_traffic", is_nemea_mod: true, is_sr_ready: true, sr_cb_ready: true}),
          new NsgModule({name: "IPFIXCOL", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "IPFIXSEND", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "vportscan_detector", is_nemea_mod: true, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "link_traffic", is_nemea_mod: true, is_sr_ready: true, sr_cb_ready: true}),
          new NsgModule({name: "IPFIXCOL", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "IPFIXSEND", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "vportscan_detector", is_nemea_mod: true, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "link_traffic", is_nemea_mod: true, is_sr_ready: true, sr_cb_ready: true}),
          new NsgModule({name: "IPFIXCOL", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "IPFIXSEND", is_nemea_mod: false, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "vportscan_detector", is_nemea_mod: true, is_sr_ready: false, sr_cb_ready: false}),
          new NsgModule({name: "link_traffic", is_nemea_mod: true, is_sr_ready: true, sr_cb_ready: true}),
      ]);
    }

    getModule(moduleName: string) : Observable<NsgModule> {
        const insts_cnt = Math.random() * 20;
        let nsgInstances = [];
        for(let i = 0; i < insts_cnt; i++) {
            console.log('pushing instance');
            nsgInstances.push(this.mockInstance(moduleName + i));
        }
        console.log('hujeeeee');

        let nsgModule = new NsgModule({
            name: moduleName,
            in_ifces_cnt: '3',
            out_ifces_cnt: '*',
            is_nemea_mod: false,
            is_sr_ready: false,
            sr_cb_ready: false,
            path: "/a/b/c/d",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            nsgInstances: nsgInstances,
        });

        return of(nsgModule);
    }

    createModule(nsgModule: NsgModule) : Observable<Response> {
        return this.http.post<NsgModule>(`/nemea/sg/modules`, nsgModule);
    }
    updateModule(nsgModuleOrigName: string, nsgModule: NsgModule) : Observable<Response> {
        return this.http.put<NsgModule>(`/nemea/sg/modules/${nsgModuleOrigName}`, nsgModule);
    }

    removeModule(moduleName: string) : Observable<Response>{
    }


/*
    private handleError(err: Response | any) {
        return Promise.reject(err);
    }
*/


    private mockInstance(name: string) : NsgInstance {

        return new NsgInstance({
            name: name,
            running: Math.random() > 0.5,
            enabled: Math.random() > 0.5,
            in_ifces_cnt: this.randomNumberStr(),
            out_ifces_cnt: this.randomNumberStr(),
        });
    }

    private randomNumberStr() : string {
        return (Math.floor(Math.random() * 20) + 1).toString();
    }

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

    private handleError(error: HttpErrorResponse) {
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
    };

}
