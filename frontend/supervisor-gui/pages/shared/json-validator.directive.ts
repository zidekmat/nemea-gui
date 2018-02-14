import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateJson]',
    providers: [{provide: NG_VALIDATORS, useExisting: JsonValidatorDirective, multi: true}]
})
export class JsonValidatorDirective implements Validator {
    validate(control: AbstractControl): {} {
        console.log('validating json');
        try {
            JSON.parse(control.value);
            return null;
        } catch (e) {
            console.log(e);
            console.log(e.toString());
            return {
                jsonValidate: e.toString()
            };
        }
    }
}