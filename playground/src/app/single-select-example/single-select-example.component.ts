import {Component, OnInit} from '@angular/core';
import {OptionModel} from '../../../../src/modules/components/single-select/model';

@Component({
  selector: 'app-single-select-example',
  template: `
    <h3>With Ajax</h3>
    <div class="row">
      <div class="col-md-4">
        <adm-input-container label="Select Country">
          <adm-single-select
            [(ngModel)]="model"
            placeholder="Select item"
            [options]="defaultOptions"
            [ajax]="ajaxParams">
          </adm-single-select>
        </adm-input-container>
        <br>
        <div class="row">
          <div class="col-md-9">
            <pre>selected value: {{model}}</pre>
          </div>
          <div class="col-md-3">
            <button (click)="model = 'AL'">Set Albania</button>
            <br>
            <button (click)="setCustomValue();">custom value</button>
          </div>
        </div>
      </div>
    </div>
    <h3>Simple Select</h3>
    <div class="row">
      <div class="col-md-4">
        <adm-input-container>
          <adm-single-select [allowCreateEntity]="true" [showAddNewBtn]="true" (onAddClicked)="onAddClicked();" [(ngModel)]="model2"
                             [options]="options"></adm-single-select>
        </adm-input-container>
      </div>
    </div>

  `
})
export class SingleSelectExampleComponent implements OnInit {
  defaultOptions: OptionModel[] = [];
  model: any;
  ajaxParams = {
    path: 'all'
  };
  options: OptionModel[] = [];

  constructor() {
    this.initDefaultOptions();
  }

  onAddClicked() {
    alert('Add new button clicked')
  }

  setCustomValue() {
    this.defaultOptions = [{value: 'custom_item', label: 'Custom Item'}];
    this.model = 'custom_item'
  }

  initDefaultOptions() {
    let arr = [];
    for (let i = 0; i < 100; i++) {
      const date = Date.now();
      const m = Math.round(Math.random() * 1000);
      arr.push({
        value: `${m}`,
        label: `item: ${m}`
      })
    }
    this.options = arr;
  }

  ngOnInit() {
  }

}
