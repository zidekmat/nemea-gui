import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
//import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {NsgYangModel} from "../models/nsg-yang-model";
import {YangLintResult} from "../models/yang-lint-result";

@Injectable()
export class NsgYangService {

    constructor(private http: Http) {}

    getModelForXpath(xpath: string, type = 'yang') : Observable<NsgYangModel> {
        // remove
        return of({
            type: type,
            value: type + 'ssssssssssss'
        });
    }

    lintValidate(jsonData: string, srModelName: string): Observable<YangLintResult> {
        return this.http.post('/nemea/validate', {model: srModelName, data: jsonData})
            .map(response => response.json() as YangLintResult);
    }

}
