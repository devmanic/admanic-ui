import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-single-select-example',
  template: `
    <h2>Single Select Component</h2>

    <h3>With Ajax</h3>

    <adm-input-container label="Some label">
      <adm-single-select placeholder="select item" [ajax]="ajaxParams">
      </adm-single-select>
    </adm-input-container>
  `
})
export class SingleSelectExampleComponent implements OnInit {
  ajaxParams = {
    path: 'campaign/list'
  };

  constructor() {
  }

  ngOnInit() {
  }

}
