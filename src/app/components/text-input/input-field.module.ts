import { NgModule } from '@angular/core';
import { AdmInputContainer } from './input-field.component';
import { CommonModule } from '@angular/common';
import { ValidatorsModule } from '../../validator/validator.module';

@NgModule({
  imports: [CommonModule, ValidatorsModule],
  exports: [AdmInputContainer],
  declarations: [AdmInputContainer],
  providers: []
})
export class InputFieldModule {
}
