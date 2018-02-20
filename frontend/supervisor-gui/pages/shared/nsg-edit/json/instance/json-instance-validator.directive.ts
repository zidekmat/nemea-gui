import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateJsonInstance]',
    providers: [{provide: NG_VALIDATORS, useExisting: JsonInstanceValidatorDirective, multi: true}]
})
export class JsonInstanceValidatorDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} {
        try {
            let instance = JSON.parse(control.value);
            console.log('valid json instance');

            return null;
        } catch (e) {
            console.log('json validate error:');
            console.log(e.toString());
            return {
                validateJsonInstance: e.toString()
            };
        }
    }
}