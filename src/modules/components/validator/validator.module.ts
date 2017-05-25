import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomValidators } from './validator.service';
import { ValidatorsMessagesComponent } from './validator-messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ValidatorsMessagesComponent
    ],
    declarations: [
        ValidatorsMessagesComponent
    ],
    providers: [
        CustomValidators
    ]
})
export class ValidatorsModule {
}
