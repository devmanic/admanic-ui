import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

export interface option {
    value: string;
    label: string
}

@Component({
    selector: 'adm-radio-list',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadioListComponent),
        multi: true
    }],
    template: `
        <div [formGroup]="_form" *ngIf="_options.length">
                <adm-radio
                        formControlName="model"
                        [value]="item.value"
                        [checked]="item.value == _form.get('model').value"
                        *ngFor="let item of _options">
                    {{item.label}}
                </adm-radio>
        </div>
        <!--<pre>{{_form.value | json:2}}</pre>-->
        <!--<hr>-->
    `
})
export class RadioListComponent implements OnDestroy {
    _options: option[] = [];
    _value: string[] = [];
    _model: FormControl = new FormControl(null);
    _required: boolean;
    _form: FormGroup = new FormGroup({
        model: this._model
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
    }

    constructor() {
        this._model.valueChanges.filter(val => !!val).subscribe((value) => {
            this.writeValue(value != this._value ? value : null);
        });
    }

    writeValue(val: any) {
        this._value = val;
        this.onChange(this._value);
        this.onTouched();
        if (!this._value) {
            this._form.get('model').setValue(null);
        }
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