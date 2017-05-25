import { NgModule } from '@angular/core';
import { AdmInputContainer, DynamicTextAreaDirective } from './input-field.component';
import { CommonModule } from '@angular/common';
import { ValidatorsModule } from '../validator/validator.module';

@NgModule({
  imports: [CommonModule, ValidatorsModule],
  exports: [AdmInputContainer, DynamicTextAreaDirective],
  declarations: [AdmInputContainer, DynamicTextAreaDirective],
  providers: []
})
export class InputFieldModule {
}
