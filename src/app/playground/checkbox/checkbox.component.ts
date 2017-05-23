import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'checkbox-playground',
  templateUrl: './checkbox.template.html'
})
export class CheckboxPlaygroundComponent {
  public form = new FormGroup({
    simple_checkbox: new FormControl(false),
    label_checkbox: new FormControl(false),
    required_checkbox: new FormControl(false, [Validators.required]),
    disabled_checkbox: new FormControl(false, [Validators.required]),
  });
}
