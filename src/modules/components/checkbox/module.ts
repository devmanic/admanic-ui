import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './component';
import { ValidatorsModule } from '../validator/module';

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
