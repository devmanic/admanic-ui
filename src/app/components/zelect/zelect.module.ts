import { NgModule } from '@angular/core';
import { ZelectComponent } from './zelect.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../../validator/validator.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule
    ],
    exports: [ZelectComponent],
    declarations: [ZelectComponent],
    providers: []
})
export class ZelectModule {
}
