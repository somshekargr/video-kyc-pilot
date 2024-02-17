import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphanumericValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }

        let alphanumericRegex = /^[a-z0-9]+$/i
        let pattern = new RegExp(alphanumericRegex);
        let result = pattern.test(value);

        if (result)
            return null;

        return { invalidAlphanumeric: true };
    }
}