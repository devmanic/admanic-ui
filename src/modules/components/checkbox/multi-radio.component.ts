import { AfterViewInit, Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

export interface option {
    value: string;
    label: string
}

@Component({
    selector: 'adm-multi-radio',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiRadioComponent),
        multi: true
    }],
    host: {
        'class': 'adm-multi-radio',
        '[class.is-inline]': 'inline'
    },
    styleUrls: ['./multi-selector.style.scss'],
    template: `
        <div [formGroup]="_form" *ngIf="_options.length" class="adm-multi-ctrl-wrap">
            <adm-radio
                    formControlName="model"
                    [value]="item.value"
                    [checked]="item.value == _value"
                    *ngFor="let item of _options">
                {{item.label}}
            </adm-radio>
        </div>
    `
})
export class MultiRadioComponent implements OnDestroy, AfterViewInit {
    _options: option[] = [];
    _value: string;
    _model: FormControl = new FormControl(null);
    _form: FormGroup = new FormGroup({
        model: this._model
    });
    _subscribers: Subscription[] = [];

    @Input() inline: boolean;

    @Input()
    set options(opts: any[]) {
        if (!!opts && Array.isArray(opts)) {
            if (opts.every(el => typeof el === 'string')) {
                this._options = opts.map((el: string) => ({
                    value: el,
                    label: el
                }));
            } else {
                this._options = opts.map(el => ({label: `${el.label}`, value: `${el.value}`}));
            }
        }
    }

    constructor() {
        this._subscribers.push(
            this._model.valueChanges.filter(val => !!val && val != this._value).subscribe((value) => {
                this.writeValue(value);
            })
        );
    }

    ngAfterViewInit() {

    }

    writeValue(val: any) {
        this._value = val;
        this.onChange(this._value);
        this.onTouched();

        if (!this._value) {
            this._form.get('model').setValue(null);
        } else if (!this._model.value || this._model.value != this._value) {
            this._form.get('model').setValue(this._value);
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