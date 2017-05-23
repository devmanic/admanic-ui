import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    Output,
    ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import uuid from 'uuid';
import { CheckboxChange } from './checkbox-change';

export const CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true
};

@Component({
    providers: [CHECKBOX_CONTROL_VALUE_ACCESSOR],
    selector: 'ui-checkbox',
    styleUrls: ['./checkbox.style.scss'],
    templateUrl: 'checkbox.template.html',
    host: {
        'class': 'ui-checkbox',
        '[class.ui-checkbox-checked]': 'checked',
        '[class.ui-checkbox-disabled]': 'disabled',
        '[class.ui-checkbox-label-before]': 'labelPosition == "before"'
    },
    inputs: ['disabled'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
    @Input('aria-label') public ariaLabel: string = '';
    @Input('aria-labelledby') public ariaLabelledby: string = null;

    public id: string = uuid.v4();

    public get inputId(): string {
        return `input-${this.id}`;
    }

    public _checked: boolean = false;

    public _required: boolean;
    @Input()
    public get required(): boolean {
        return this._required;
    }

    public set required(value) {
        this._required = value;
    }

    @Input() public labelPosition: 'before' | 'after' = 'after';

    @Input() public tabIndex: number = 0;

    @Input() public name: string = null;

    @Output() public change: EventEmitter<CheckboxChange> = new EventEmitter<CheckboxChange>();

    @Input() public value: string;

    @ViewChild('input') public _inputElement: ElementRef;

    @ViewChild('labelWrapper') public _labelWrapper: ElementRef;

    constructor(private _elementRef: ElementRef,
                private _changeDetectorRef: ChangeDetectorRef) {

    }

    @Input()
    public get checked() {
        return this._checked;
    }

    public set checked(checked: boolean) {
        if (checked != this.checked) {
            this._checked = checked;
            this._changeDetectorRef.markForCheck();
        }
    }

    public writeValue(value: any) {
        this.checked = !!value;
    }

    public registerOnChange(fn: (value: any) => void) {
        this._controlValueAccessorChangeFn = fn;
    }

    public registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    public onTouched: () => any = () => {};

    public setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    }

    public toggle(): void {
        this.checked = !this.checked;
    }

    public _onInputClick(event: Event) {
        event.stopPropagation();

        if (!this.disabled) {
            this.toggle();
            this._emitChangeEvent();
        }
    }

    public _onInteractionEvent(event: Event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the `change` output.
        event.stopPropagation();
    }

    public _hasLabel(): boolean {
        const labelText = this._labelWrapper.nativeElement.textContent || '';
        return !!labelText.trim().length;
    }

    private _controlValueAccessorChangeFn: (value: any) => void = (value) => {};

    private _emitChangeEvent() {
        let event = new CheckboxChange();
        event.source = this;
        event.checked = this.checked;

        this._controlValueAccessorChangeFn(this.checked);
        this.change.emit(event);
    }
}
