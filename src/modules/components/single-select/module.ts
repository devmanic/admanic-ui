import { ModuleWithProviders, NgModule } from '@angular/core';
import { SingleSelectComponent } from './single-select.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../validator/module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SingleSelectOptions } from './options.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule,
        SharedModule
    ],
    exports: [SingleSelectComponent, RouterModule],
    declarations: [SingleSelectComponent]
})
export class SingleSelectModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: SingleSelectModule,
            providers: [SingleSelectOptions]
        };
    }
}
