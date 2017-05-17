import { NgModule } from '@angular/core';
import { AdmInputContainer, AdmInputDirective } from './input-field.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule],
  exports: [AdmInputContainer, AdmInputDirective],
  declarations: [AdmInputContainer, AdmInputDirective],
  providers: []
})
export class InputFieldModule {
}
