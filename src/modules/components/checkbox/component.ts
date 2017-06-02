import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output, ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export const CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
};

@Component({
    providers: [CHECKBOX_CONTROL_VALUE_ACCESSOR],
    selector: 'adm-checkbox',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./style.scss'],
    template: `
        <label *ngIf="label"></label>
        <div class="adm-checkbox__el"></div>
    `,
    host: {
        'class': 'adm-checkbox',
        '(click)': 'toggle()',
        '[attr.checked]': '_checked',
        '[class.is-checked]': '_checked',
        '[attr.disabled]': 'disabled',
        '[class.is-disabled]': 'disabled'
    }
})
export class CheckboxComponent {
    id: string = String(Date.now());

    get inputId(): string {
        return `adm-checkbox-${this.id}`;
    }

    _checked: boolean;
    _required: boolean;

    @Input() disabled: boolean;
    @Input() required: boolean;
    @Input() value: string;

    @Input()
    set checked(val: boolean) {
        this._checked = val;
    }

    @Output() change: EventEmitter<boolean> = new EventEmitter();

    constructor(private el: ElementRef) {
    }

    writeValue(val: any) {
        this._checked = !!val;
        this.onChange(this._checked);
        this.onTouched();
        this.change.emit(this._checked);
    }

    toggle(): void {
        if (!this.disabled) {
            this.writeValue(!this._checked);
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
}
