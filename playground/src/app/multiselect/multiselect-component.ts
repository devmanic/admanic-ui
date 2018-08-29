import {Component, OnInit} from '@angular/core';
import {MultiselectParams} from '../../../../src/modules/components/multi-select/model';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'multiselect-component',
  templateUrl: 'multiselect-component.component.html'
})

export class MultiselectExampleComponent implements OnInit {
  params: MultiselectParams = {};
  options = [
    {value: '1', label: 'Label 1'},
    {value: '2', label: 'Label 2'}
  ];

  form = new FormGroup({
    test: new FormControl([])
  })

  constructor() {
  }

  ngOnInit() {
  }
}
