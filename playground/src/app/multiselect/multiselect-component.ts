import {Component, OnInit} from '@angular/core';
import {MultiselectParams} from '../../../../src/modules/components/multi-select/model';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'multiselect-component',
  templateUrl: 'multiselect-component.component.html'
})

export class MultiselectExampleComponent implements OnInit {
  params: MultiselectParams = {
    orderByInput: true,
    showSelectedCount: 2
  };
  options = [
    {value: '1', label: 'Label 1'},
    {value: '2', label: 'Label 2'},
    {value: '3', label: 'Label 3'},
    {value: '4', label: 'Label 4'},
    {value: '5', label: 'Label 5'},
    {value: '6', label: 'Label 6'},
    {value: '7', label: 'Label 7'},
    {value: '8', label: 'Label 8'},
    {value: '9', label: 'Label 9'},
    {value: '10', label: 'Label 10'},
    {value: '11', label: 'Label 11'},
    {value: '12', label: 'Label 12'},
  ];

  form = new FormGroup({
    test: new FormControl([])
  })

  constructor() {
  }

  ngOnInit() {
  }
}
