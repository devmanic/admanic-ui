import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'adm-input-container',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['styles.scss'],
  host: {
    '[class.adm-input__container]': 'true',
    '[class.is-invalid]': 'invalid',
    '[class.with-addon]': '!!addonIcon'
  },
  template: `
    <label class="adm-input__label" [ngClass]="{'is-required':required}" *ngIf="!!label">{{label}}</label>
    <div class="wrap">
      <div *ngIf="!!addonIcon" class="adm-input__addon">
        <i class="material-icons">{{addonIcon}}</i>
      </div>
      <ng-content></ng-content>
    </div>
    <div *ngIf="control && invalid">
      <validator-messages [field]="control"></validator-messages>
    </div>
  `
})
export class AdmInputContainer {
  _ctrl: FormControl;

  @Input() set control(ctrl: FormControl) {
    this.required = ctrl.hasError('required');
    this._ctrl = ctrl;
  };

  get control(): FormControl {
    return this._ctrl;
  }

  @Input() addonIcon: string;
  @Input() label: string;

  required: boolean = false;

  get invalid(): boolean {
    if (this.control) {
      if (this.control.touched) {
        return this.control.invalid;
      }
    }
    return false;
  }
}
