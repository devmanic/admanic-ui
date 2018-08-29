import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import * as admUI from 'admanic-ui';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {MultiselectExampleComponent} from './multiselect/multiselect-component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    MultiselectExampleComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    RouterModule.forRoot([
      {path: 'multi-select', component: MultiselectExampleComponent}
    ]),
    admUI.MultiSelectModule,
    admUI.InputModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    window['SERVER'] = 'sadsa';
  }
}
