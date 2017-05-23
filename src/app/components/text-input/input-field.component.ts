import { AfterViewInit, Component, Directive, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
  selector: 'input[admanic], textarea[admanic]',
  host: {
    '[class.bla]': 'true'
  }
})
export class AdmInputDirective {

  constructor() {
    console.log('---AdmInputDirective----');
  }
}

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
    <div>
      <!--<pre>{{invalid}}</pre>-->
      <div class="wrap">
        <div *ngIf="!!addonIcon" class="adm-input__addon">
          <i class="material-icons">{{addonIcon}}</i>
        </div>
        <ng-content></ng-content>
      </div>
      <div *ngIf="control && invalid">
        <validator-messages [field]="control"></validator-messages>
      </div>
    </div>
  `
})
export class AdmInputContainer {
  @Input() control: FormControl;
  @Input() addonIcon: string = '';

  get invalid(): boolean {
    if (this.control) {
      if (this.control.touched) {
        return this.control.invalid;
      }
    }
    return false;
  }
}
