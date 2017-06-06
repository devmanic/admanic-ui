import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

export interface option {
    value: string;
    label: string
}

@Component({
    selector: 'adm-multi-checkbox',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CheckboxArrayComponent),
        multi: true
    }],
    template: `
        <div [formGroup]="_form" *ngIf="arr.length">
            <div formArrayName="arr">
                <adm-checkbox
                        *ngFor="let item of arr"
                        [formControl]="item"
                        [value]="item.param.value">
                    {{item.param.label}}
                </adm-checkbox>
            </div>
        </div>
    `
})
export class CheckboxArrayComponent implements OnDestroy {
    _options: option[] = [];
    _value: string[] = [];
    _arr: FormArray = new FormArray([]);
    _required: boolean;
    _form: FormGroup = new FormGroup({
        arr: this._arr
    });
    _subscribers: Subscription[] = [];

    @Input()
    set options(opts: any[]) {
        if (typeof opts[0] === 'string') {
            this._options = opts.map((el: string) => ({
                value: el,
                label: el
            }));
        }

        this._options.forEach((el: option) => {
            this._arr.push(
                _.assign(new FormControl(''), {param: el})
            );
        });
    }

    get arr(): any[] {
        return this._arr.controls;
    }

    constructor() {
        this._arr.valueChanges.subscribe((value: string[]) => {
            this.writeValue(value.filter(el => !!el));
        });
    }

    writeValue(val: any) {
        this._value = val;
        this.onChange(this._value);
        this.onTouched();
    }

    onChange: Function = (_: any) => {
    };
    onTouched: Function = () => {
    };

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    ngOnDestroy() {
        this._subscribers.forEach((el: Subscription) => el.unsubscribe());
    }
}