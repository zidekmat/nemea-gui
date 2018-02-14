import { Directive } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[validateJsonModule]',
    providers: [{provide: NG_VALIDATORS, useExisting: JsonModuleValidatorDirective, multi: true}]
})
export class JsonModuleValidatorDirective implements Validator {
    validate(control: AbstractControl): {[key: string]: any} {
        try {
            let module = JSON.parse(control.value);
            let keys = Object.keys(module);

            if (keys.length != 1 || keys[0] != 'nemea:supervisor') {
                return {
                    validateJsonModule: "Invalid JSON: nemea:supervisor key is missing" +
                    " inside root JSON object"
                };
            }

            keys = Object.keys(module['nemea:supervisor']);
            if (keys.length != 1 || keys[0] != 'available-module') {
                return {
                    validateJsonModule: "Invalid JSON: available-module key is missing" +
                    " inside nemea:supervisor JSON object"
                };
            }

            if (module['nemea:supervisor']['available-module'].length != 1) {
                return {
                    validateJsonModule: "Invalid JSON: available-module JSON array must" +
                    " have length of 1"
                };
            }
            console.log('valid json module');

            return null;
        } catch (e) {
            console.log('json validate error:');
            console.log(e.toString());
            return {
                validateJsonModule: e.toString()
            };
        }
    }
}