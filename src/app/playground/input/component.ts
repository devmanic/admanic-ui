import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'input-pg',
  templateUrl: 'template.html'
})
export class PGInputComponent implements OnInit {
  form: FormGroup = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    last_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    r: new FormControl('', [Validators.required]),
    a: new FormControl('', [Validators.required]),
  });

  constructor() {
  }

  ngOnInit() {
  }
}
