import { NgModule } from '@angular/core';
import { InputContainer, DynamicTextAreaDirective } from './component';
import { CommonModule } from '@angular/common';
import { ValidatorsModule } from '../validator/module';

@NgModule({
  imports: [CommonModule, ValidatorsModule],
  exports: [InputContainer, DynamicTextAreaDirective],
  declarations: [InputContainer, DynamicTextAreaDirective],
  providers: []
})
export class InputModule {
}
