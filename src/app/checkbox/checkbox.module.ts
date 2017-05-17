import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../validator/validator.module';
import { CheckboxComponent } from './checkbox.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule
    ],
    exports: [CheckboxComponent],
    declarations: [CheckboxComponent],
    providers: []
})
export class CheckboxModule {
}
