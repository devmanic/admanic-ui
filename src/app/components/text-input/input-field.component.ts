import { AfterViewInit, Component, Directive, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: 'input[adm], textarea[adm]',
  host:{
    '[class.bla]':'true'
  }
})
export class AdmInputDirective {

  constructor() {
    console.log('---AdmInputDirective----');
  }
}


@Component({
  selector:'adm-input-container',
  encapsulation: ViewEncapsulation.None,
  template:`
    input container
    <div>
      <ng-content></ng-content>
    </div>
  `
})
export class AdmInputContainer{

}
