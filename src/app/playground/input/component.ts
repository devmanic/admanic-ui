import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'input-pg',
  templateUrl: 'template.html'
})
export class PGInputComponent implements OnInit {
  form:FormGroup = new FormGroup({
    first_name:new FormControl('')
  })
  constructor() {
  }

  ngOnInit() {
  }
}
