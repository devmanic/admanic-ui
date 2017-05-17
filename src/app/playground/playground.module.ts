import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlaygroundComponent } from './playground.component';
import { ZelectPlaygroundComponent } from './zelect/zelect.component';
import { ValidatorsModule } from '../validator/validator.module';
import { ZelectModule } from '../components/zelect/zelect.module';

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
