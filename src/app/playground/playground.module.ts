import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { ZelectPlaygroundComponent } from './zelect/zelect.component';
import { ValidatorsModule } from '../validator/validator.module';
import { ZelectModule, InputFieldModule } from '../components/index';
import { PGInputComponent } from './input/component';

@NgModule({
  declarations: [
    PlaygroundComponent,
    ZelectPlaygroundComponent,
    PGInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ZelectModule,
    InputFieldModule,
    ValidatorsModule
  ],
  providers: []
})
export class PlaygroundModule {

}
