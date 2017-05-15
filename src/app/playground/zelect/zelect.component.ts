import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'zelect-playground',
  templateUrl: './zelect.template.html'
})
export class ZelectPlaygroundComponent {
  public options: any[] = [];

  public form = new FormGroup({
    select: new FormControl('')
  });

  constructor() {
    for (let i = 1; i < 16; i++) {
      this.options.push(this.generateSelectItem(i));
    }
  }

  public onCreate(event) {
    console.log(event);
  }

  private generateSelectItem(i: number) {
    return {
      value: Math.floor(Math.random() * (i * 1000)).toString(),
      label: `item  ${ Math.floor(Math.random() * (i * 1000)).toString()}`
    };
  }
}
