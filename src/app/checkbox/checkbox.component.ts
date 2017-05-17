import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges,
  OnDestroy, Output, ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import uuid from 'uuid';

export class MdCheckboxChange {
  source: CheckboxComponent;
  checked: boolean;
}

export const MD_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true
};

@Component({
  moduleId: module.id,
  providers: [MD_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  selector: 'ui-checkbox',
  styleUrls: ['./checkbox.style.scss'],
  templateUrl: 'checkbox.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  @Input('aria-label') ariaLabel: string = '';
  @Input('aria-labelledby') ariaLabelledby: string = null;

  public id: string = uuid.v4();

  public get inputId(): string {
    return `input-${this.id}`;
  }

  private _required: boolean;

  @Input()
  get required(): boolean { return this._required; }
  set required(value) { this._required = value; }

  @Input() labelPosition: 'before' | 'after' = 'after';

  @Input() tabIndex: number = 0;

  @Input() name: string = null;

  @Output() change: EventEmitter<MdCheckboxChange> = new EventEmitter<MdCheckboxChange>();

  @Output() indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() value: string ;

  @ViewChild('input') _inputElement: ElementRef;

  @ViewChild('labelWrapper') _labelWrapper: ElementRef;
}
