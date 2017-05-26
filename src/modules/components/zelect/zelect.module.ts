import { ModuleWithProviders, NgModule } from '@angular/core';
import { ZelectComponent } from './zelect.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidatorsModule } from '../validator/validator.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ValidatorsModule,
        SharedModule,
        RouterModule.forRoot([])
    ],
    exports: [ZelectComponent, RouterModule],
    declarations: [ZelectComponent]
})
export class ZelectModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ZelectModule,
            providers:[]
        };
    }
}
