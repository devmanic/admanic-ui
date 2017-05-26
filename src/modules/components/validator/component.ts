import { Component, Input, forwardRef, ViewEncapsulation } from '@angular/core';
import { FormControl, NG_VALIDATORS } from '@angular/forms';
import { CustomValidators } from './service';

@Component({
    selector: 'adm-validator-messages',
    template: `{{errorMessage}}`,
    styleUrls: ['styles.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.adm-validator-message]': 'true',
        '[class.is-active]': 'errorMessage !== ""'
    },
    providers: [
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => ValidatorsMessagesComponent), multi: true}
    ]
})
export class ValidatorsMessagesComponent {
    @Input() public field: FormControl;
    @Input() public errorType: string;

    public get errorMessage(): string {
        if (this.errorType) {
            if (this.field.errors.hasOwnProperty(this.errorType) && (this.field.dirty || this.field.touched)) {
                return CustomValidators.getValidatorErrorMessage(this.errorType, this.field.errors[this.errorType]);
            }
        }
        for (let propertyName in this.field.errors) {
            if (this.field.errors.hasOwnProperty(propertyName) && (this.field.dirty || this.field.touched)) {
                return CustomValidators.getValidatorErrorMessage(propertyName, this.field.errors[propertyName]);
            }
        }
        return '';
    }
}
