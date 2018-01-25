import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import * as admUI from 'admanic-ui';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {ButtonExampleComponent} from './button-example/button-example.component';
import {SingleSelectExampleComponent} from './single-select-example/single-select-example.component';

export class customSingleSelectOptions extends admUI.SingleSelectOptions {
  server = 'http://some-server.net';
  pagination = true;
  requestHeaders = {
    Authorization: 'Bearer sadasdsad'
  };

  requestResponseMapFn: Function = (el: any) => ({
    label: `item: ${el.title}`,
    value: el.id
  })
}

@NgModule({
  declarations: [
    AppComponent,
    ButtonExampleComponent,
    SingleSelectExampleComponent
  ],
  imports: [
    RouterModule.forRoot([
      {path: 'buttons', component: ButtonExampleComponent},
      {path: 'single-select', component: SingleSelectExampleComponent}
    ]),
    admUI.SingleSelectModule.forRoot(),
    admUI.InputModule,
    admUI.ButtonsModule,
    BrowserModule
  ],
  providers: [
    {provide: admUI.SingleSelectOptions, useClass: customSingleSelectOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
