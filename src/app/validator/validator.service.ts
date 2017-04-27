import _ from 'lodash';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomValidators {
    public static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = _.merge({
            required: 'Required',
            minlength: `Minimum length ${validatorValue.requiredLength}`,
            maxlength: `Maximum length ${validatorValue.requiredLength}`,
            isEmptyPattern: 'Can`t be empty',
            stringPattern: 'Can contain only letters, numbers, spaces and `, . / * _ -` symbols.',
            numberPattern: 'Can contain only positive numbers',
            emailPattern: 'Invalid email',
            passwordPattern: 'Password must have at least one digit, lower and upper case letter',
            nospacePattern: 'No whitespace allowed',
            passwordEqualPattern: 'Confirm password and password fields must be equal',
            ipPattern: 'Ip incorrect',
            allFill: 'All fields must be filled',
            urlPattern: 'Is not a valid URL',
        }, {});

        return config[validatorName];
    }

    public static isEmptyValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return !_.isEmpty(control.value) ? null : {isEmptyPattern: false};
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
                if (_.toNumber(control.value)) {
                    if (isPositive) {
                        if (_.toNumber(control.value) > 0) {
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
                if (_.find(control.controls, (item: any) => !(item.value || _.isBoolean(item.value)))) {
                    return {allFill: false};
                } else {
                    return null;
                }
            }
        };
    };

    public static tsUpdateTokensValidator(): ValidatorFn {
        return (control: AbstractControl | any): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                let allRequiredCond = _.find(control.controls, (item: any) => {
                    return !(item.value || _.isBoolean(item.value));
                });

                let allFieldsEmpty = _.filter(control.controls, (item: any) => {
                        return (item.dirty && !item.value) || item._skipValidation;
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
        let patternIp4 = /^(?:(?:2(?:[0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9])\.){3}(?:(?:2([0-4][0-9]|5[0-5])|[0-1]?[0-9]?[0-9]))$/;
        let patternIp6 = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                if (patternIp6.test(control.value)) {
                    return null;
                } else {
                    if (patternIp4.test(control.value)) {
                        return null;
                    } else {
                        return {ipPattern: false};
                    }
                }
            }
        };
    };

    public static max100NumberValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                if (_.toNumber(control.value)) {
                    if (_.toNumber(control.value) <= 100) {
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
                if (_.toNumber(control.value)) {
                    if (isPositive) {
                        if (_.toNumber(control.value) > 0) {
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
        let pattern = /^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(?::\d{1,5})?(?:$|[?\/#])/i;
        return (control: AbstractControl): { [key: string]: any } => {
            if (_.isEmpty(control.value)) {
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
