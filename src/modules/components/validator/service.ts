import { merge, toNumber, isEmpty, find, isBoolean } from 'lodash';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomValidators {
    private static patternIp4 = /^(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))$/;
    private static patternIp6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;

    public static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = merge({
            required: 'Required',
            minlength: `Minimum length ${validatorValue.requiredLength}`,
            maxlength: `Maximum length ${validatorValue.requiredLength}`,
            max: `Maximum count is ${validatorValue.max}`,
            isEmptyPattern: 'Can`t be empty',
            stringPattern: 'Can contain only letters, numbers, spaces and `, . / * _ -` symbols.',
            numberPattern: 'Can contain only positive numbers',
            emailPattern: 'Invalid email',
            passwordPattern: 'Password must have at least one digit, lower and upper case letter',
            nospacePattern: 'No whitespace allowed',
            passwordEqualPattern: 'Confirm password and password fields must be equal',
            positiveNumberPattern: 'Can contain only positive numbers',
            ipPattern: 'Ip incorrect',
            ipArrayPattern: 'Ip list incorrect',
            allFill: 'All fields must be filled',
            nT: 'All fields must be filled',
            urlPattern: 'Is not a valid URL',
            acceptRules: 'You should to accept the rules',
            notAllowSpace: 'Can not contain white spaces'
        }, {});

        return config[validatorName];
    }

    public static isEmptyValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return !isEmpty(control.value) ? null : {isEmptyPattern: false};
            }
        };
    }

    public static notAllowWhiteSpacesValidator(): ValidatorFn {
        let pattern = /^\S*$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {notAllowSpace: false};
            }
        };
    }

    public static stringPatternValidator(): ValidatorFn {
        let pattern = /^[\w\s-,._\/*]+$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {stringPattern: false};
            }
        };
    }

    public static ZelectQueryValidator(): ValidatorFn {
        let pattern = /^[\w\s-,._\/*]+$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {stringPattern: false};
            }
        };
    }

    public static numberPatternValidator(isPositive: boolean = true): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                if (toNumber(control.value)) {
                    if (isPositive) {
                        if (toNumber(control.value) > 0) {
                            return null;
                        } else {
                            return {positiveNumberPattern: false};
                        }
                    } else {
                        return null;
                    }
                } else {
                    return {numberPattern: false};
                }
            }
        };
    }

    public static emailPatternValidator(): ValidatorFn {
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {emailPattern: false};
            }
        };
    };

    public static passwordPatternValidator(): ValidatorFn {
        let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {passwordPattern: false};
            }
        };
    };

    public static nospacePatternValidator(): ValidatorFn {
        let pattern = /^(?=\S+$)/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {nospacePattern: false};
            }
        };
    };

    public static isPasswordEqualValidator(): ValidatorFn {
        return (control: any): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return control.controls['password'].value === control.controls['password_confirm'].value ? null : {passwordEqualPattern: false};
            }
        };
    };

    public static isAllFillValidator(): ValidatorFn {
        return (control: AbstractControl | any): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                if (find(control.controls, (item: any) => !(item.value || isBoolean(item.value)))) {
                    return {allFill: false};
                } else {
                    return null;
                }
            }
        };
    };

    public static NTValidator(): ValidatorFn {
        return (control: AbstractControl | any): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {

                let condition_id = control.controls['condition_id'];
                if (!(condition_id.value || isBoolean(condition_id.value))) {
                    return {nT: false};
                }

                let entity_id = control.controls['entity_id'];
                let entity_type = control.controls['entity_type'];

                if (control.controls['nestedTargeting'].length > 0 && control.controls['check_entity'].value) {
                    if (!(entity_id.value || isBoolean(entity_id.value))) {
                        return {nT: false};
                    }
                    if (!(entity_type.value || isBoolean(entity_type.value))) {
                        return {nT: false};
                    }
                }

                return null;
            }
        };
    };

    public static tsUpdateTokensValidator(): ValidatorFn {
        return (control: AbstractControl | any): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                let allRequiredCond = find(control.controls, (item: any) => {
                    return !(item.value || isBoolean(item.value));
                });

                let allFieldsEmpty = control.controls.filter((item: any) => {
                    return !item.value || item._skipValidation;
                }).length === Object.keys(control.controls).length;

                if (!allRequiredCond || allFieldsEmpty) {
                    return null;
                } else {
                    return {allFill: false};
                }
            }
        };
    };

    public static ipPatternValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                if (this.patternIp6.test(control.value)) {
                    return null;
                } else {
                    if (this.patternIp4.test(control.value)) {
                        return null;
                    } else {
                        return {ipPattern: false};
                    }
                }
            }
        };
    };

    public static ipArrayPatternValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                if (control.value.every((el: any) => this.patternIp6.test(el) || this.patternIp4.test(el))) {
                    return null;
                } else {
                    return {ipArrayPattern: false};
                }
            }
        };
    };

    public static max100NumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                if (toNumber(control.value)) {
                    if (toNumber(control.value) <= 100) {
                        return null;
                    } else {
                        return {max100Number: false};
                    }
                } else {
                    return {numberPattern: false};
                }
            }
        };
    }

    public static integerPatternValidator(isPositive: boolean = true): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                if (toNumber(control.value)) {
                    if (isPositive) {
                        if (toNumber(control.value) > 0) {
                            if (/^[1-9]\d*(,\d+)?$/.test(control.value)) {
                                return null;
                            } else {
                                return {integerNumberPattern: false};
                            }
                        } else {
                            return {positiveNumberPattern: false};
                        }
                    } else {
                        return null;
                    }
                } else {
                    return {numberPattern: false};
                }
            }
        };
    }

    public static urlValidator(): ValidatorFn {
        let pattern = /^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(?::\d{1,5})?(?:$|[?\/#])?(?:$|[{}]*)/i;
        return (control: AbstractControl): { [key: string]: any } => {
            if (isEmpty(control.value)) {
                return null;
            }
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {urlPattern: false};
            }
        };
    }
}
