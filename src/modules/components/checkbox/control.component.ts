import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output, ViewEncapsulation
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

export const CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxControlComponent),
    multi: true
};

const CHECKBOX_CLASS: string = 'adm-checkbox';
const RADIO_CLASS: string = 'adm-radio';

@Component({
    providers: [CHECKBOX_CONTROL_VALUE_ACCESSOR],
    selector: 'adm-checkbox, adm-radio',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./style.scss'],
    template: `
        <div class="{{baseClassName}}__wrap">
            <div class="{{baseClassName}}__el" (click)="toggle();"></div>
            <div class="{{baseClassName}}__label" [class.is-required]="_required" (click)="toggle();">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    host: {
        '[class]': 'baseClassName',
        '[attr.checked]': 'checked',
        '[class.is-checked]': 'checked',
        '[attr.disabled]': 'disabled',
        '[class.is-disabled]': 'disabled',
        '[class.is-rtl]': 'rtl'
    }
})
export class CheckboxControlComponent {
    _checked: boolean | string;
    _required: boolean;
    _ctrl: FormControl;
    _type: 'checkbox' | 'radio' = 'checkbox';

    @Input() disabled: boolean;
    @Input() rtl: boolean;
    @Input() value: string;

    @Input()
    set control(ctrl: FormControl) {
        this._required = ctrl.hasError('required');
        this._ctrl = ctrl;
    }

    @Input()
    set checked(val: boolean | string) {
        this._checked = !!val;
    }

    get checked(): boolean | string {
        if (this.isRadio) {
            return this._checked;
        }
        return !this.value ? this._checked : this._checked == this.value;
    }

    @Output() change: EventEmitter<boolean | string> = new EventEmitter();

    constructor(private el: ElementRef) {
        this._type = el.nativeElement.localName === 'adm-checkbox' ? 'checkbox' : 'radio';
    }

    get isCheckbox(): boolean {
        return this._type === 'checkbox';
    }

    get isRadio(): boolean {
        return this._type === 'radio';
    }

    get baseClassName(): string {
        return this.isRadio ? RADIO_CLASS : CHECKBOX_CLASS;
    }

    writeValue(val: any) {
        this._checked = (val === true || val === 1) ? true : val;
        this.onChange(this._checked);
        this.onTouched();
        this.change.emit(this._checked);
    }

    toggle(): void {
        if (!this.disabled) {
            this.writeValue(!this.value ? !this._checked : this._checked == this.value ? null : this.value);
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
