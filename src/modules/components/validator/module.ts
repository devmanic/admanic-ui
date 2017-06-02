import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomValidators } from './service';
import { ValidatorsMessagesComponent } from './component';
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
