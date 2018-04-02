import { Directive, Input } from '@angular/core';
import { Validator, AbstractControl, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';
import {NsgYangService} from "../../services/nsg-yang.service";
import { Observable } from 'rxjs/Observable';
import {YangLintResult} from "../../models/yang-lint-result";


@Directive({
    selector: '[validateYangLint]',
    providers: [
        NsgYangService,
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: YangLintValidatorDirective,
            multi: true
        }
    ]
})
export class YangLintValidatorDirective implements Validator {

    @Input('srModuleName') srModuleName: string;

    constructor(private nsgYangService: NsgYangService) {
    }

    validate(control : AbstractControl ) : Observable<ValidationErrors> {
        console.log('validate observable');
        return this.nsgYangService.lintValidate(control.value, this.srModuleName).map(
            (res) => {
                console.log('Yang lint validating service response:');
                console.log(res);
                if (res.valid) {
                    return null;
                } else {
                    return {
                        validateYangLint: res.errors
                    };
                }
            },
            (error) => {
                // TODO
                console.log('Yang lint validation failed:');
                console.log(error);
                return {
                    validateYangLint: [error]
                };
            }
        );
    }
}