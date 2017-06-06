import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './component';
import { ValidatorsModule } from '../validator/module';
import { CheckboxArrayComponent } from './checkbox-array.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule
    ],
    exports: [CheckboxComponent, CheckboxArrayComponent],
    declarations: [CheckboxComponent, CheckboxArrayComponent],
    providers: []
})
export class CheckboxModule {
}
