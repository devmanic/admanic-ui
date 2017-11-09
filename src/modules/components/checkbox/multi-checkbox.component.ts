import { AfterViewInit, Component, forwardRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { assign } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

export interface option {
    value: string;
    label: string
}

@Component({
    selector: 'adm-multi-checkbox',
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MultiCheckboxComponent),
        multi: true
    }],
    styleUrls: ['./multi-selector.style.scss'],
    host: {
        'class': 'adm-multi-checkbox',
        '[class.is-inline]': 'inline'
    },
    template: `
        <div [formGroup]="_form" *ngIf="arr.length">
            <div formArrayName="arr" class="adm-multi-ctrl-wrap">
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
export class MultiCheckboxComponent implements OnDestroy, AfterViewInit {
    _options: option[] = [];
    _value: string[] = [];
    _arr: FormArray = new FormArray([]);
    _form: FormGroup = new FormGroup({
        arr: this._arr
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

            this._options.forEach((el: option) => {
                this._arr.push(
                    assign(new FormControl(''), {param: el})
                );
            });
        }
    }

    get arr(): any[] {
        return this._arr.controls;
    }

    ngAfterViewInit() {
        this._value.forEach((el: string) => {
            let item: FormControl = this.arr.filter(item => item.param.value === el)[0];
            if (!!item) item.setValue(el);
        });
        this._subscribers.push(
            this._arr.valueChanges.subscribe((value: string[]) => {
                this.writeValue(value.filter(el => !!el));
            })
        );
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