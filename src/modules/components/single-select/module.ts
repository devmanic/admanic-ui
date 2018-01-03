import { NgModule } from '@angular/core';
import { SingleSelectComponent } from './single-select.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../validator/module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ToastModule } from '../toastr/module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule,
        SharedModule,
        ToastModule
    ],
    exports: [SingleSelectComponent, RouterModule],
    declarations: [SingleSelectComponent],
    providers: []
})
export class SingleSelectModule {
}
