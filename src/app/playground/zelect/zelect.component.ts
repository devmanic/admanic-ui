import {Component} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'zelect-playground',
  templateUrl: './zelect.template.html'
})
export class ZelectPlaygroundComponent {
  public options: any[] = [];
  public select_with_add_new: any[] = [];
  public options_with_groups: any[] = [];
  public select_with_new_entity: any[] = [];

  public form = new FormGroup({
    select: new FormControl(''),
    select_with_add_new: new FormControl(''),
    options_with_groups: new FormControl(''),
    select_with_new_entity: new FormControl(''),
    select_with_allowClear: new FormControl(''),
    select_with_icon: new FormControl(''),
  });

  constructor() {
    let generateItems = (len: number): any[] => {
      let arr = [];
      for (let i = 1; i < len; i++) {
        arr.push(this.generateSelectItem(i + 3));
      }
      return arr;
    };

    for (let i = 1; i < 5; i++) {
      this.select_with_new_entity.push(this.generateSelectItem(i));
    }

    for (let i = 1; i < 16; i++) {
      this.options.push(this.generateSelectItem(i));
      this.select_with_add_new.push(this.generateSelectItem(i + 3));
      this.options_with_groups.push({
        name: `group #${i}`,
        values: generateItems(5)
      });
    }
  }

  public onCreate(event) {
    console.log(event);
  }

  public newEntityAdd(e) {
    console.info(`add new entity, title: ${e}`);
  }

  private generateSelectItem(i: number) {
    let val = Math.floor(Math.random() * (i * 1000)).toString();
    return {
      value: val,
      label: `item  ${val}`
    };
  }
}
