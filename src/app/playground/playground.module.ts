import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import { ZelectModule } from '../zelect/zelect.module';
import { PlaygroundComponent } from './playground.component';

@NgModule({
  declarations: [
    PlaygroundComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ZelectModule
  ],
  providers: [

  ]
})
export class PlaygroundModule {

}
