import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZelectModule } from '../zelect/zelect.module';
import { PlaygroundComponent } from './playground.component';
import { ZelectPlaygroundComponent } from './zelect/zelect.component';
import {ValidatorsModule} from "../validator/validator.module";

@NgModule({
    declarations: [
        PlaygroundComponent,
        ZelectPlaygroundComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ZelectModule,
      ValidatorsModule
    ],
    providers: []
})
export class PlaygroundModule {

}
