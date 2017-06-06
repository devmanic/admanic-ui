import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxControlComponent } from './control.component';
import { ValidatorsModule } from '../validator/module';
import { MultiCheckboxComponent } from './multi-checkbox.component';
import { MultiRadioComponent } from './multi-radio.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule
    ],
    exports: [CheckboxControlComponent, MultiCheckboxComponent, MultiRadioComponent],
    declarations: [CheckboxControlComponent, MultiCheckboxComponent, MultiRadioComponent],
    providers: []
})
export class CheckboxAndRadioModule {
}
