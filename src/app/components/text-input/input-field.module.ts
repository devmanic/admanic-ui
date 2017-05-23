import { NgModule } from '@angular/core';
import { AdmInputContainer, AdmInputDirective } from './input-field.component';
import { CommonModule } from '@angular/common';
import { ValidatorsModule } from '../../validator/validator.module';

@NgModule({
  imports: [CommonModule, ValidatorsModule],
  exports: [AdmInputContainer, AdmInputDirective],
  declarations: [AdmInputContainer, AdmInputDirective],
  providers: []
})
export class InputFieldModule {
}
