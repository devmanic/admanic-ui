import { AfterViewInit, Component, Directive, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

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
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export class AdmInputContainer {

}
