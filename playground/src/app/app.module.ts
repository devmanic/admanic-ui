import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import * as admUI from 'admanic-ui';
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {ButtonExampleComponent} from './button-example/button-example.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonExampleComponent,
  ],
  imports: [
    HttpModule,
    RouterModule.forRoot([
      {path: 'buttons', component: ButtonExampleComponent}
    ]),
    admUI.SingleSelectModule,
    admUI.InputModule,
    admUI.ButtonsModule,
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
