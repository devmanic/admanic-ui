import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZelectModule } from '../zelect/zelect.module';
import { PlaygroundComponent } from './playground.component';
import { ZelectPlaygroundComponent } from './zelect/zelect.component';
import { ValidatorsModule } from '../validator/validator.module';
import { CheckboxPlaygroundComponent } from './checkbox/checkbox.component';
import { CheckboxModule } from '../checkbox/checkbox.module';

@NgModule({
    declarations: [
        PlaygroundComponent,
        ZelectPlaygroundComponent,
        CheckboxPlaygroundComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ZelectModule,
        CheckboxModule,
        ValidatorsModule
    ],
    providers: []
})
export class PlaygroundModule {

}
