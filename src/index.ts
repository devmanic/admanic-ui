import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZelectModule } from './modules/components/zelect/zelect.module';
import { InputFieldModule } from './modules/components/text-input/input-field.module';
import { ValidatorsModule } from './modules/components/validator/validator.module';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ZelectModule,
        InputFieldModule,
        ValidatorsModule
    ],
    declarations: [],
    exports: []
})
export class AdmamicUiModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AdmamicUiModule,
            providers: []
        };
    }
}
