import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import * as admUI from 'admanic-ui';
import {RouterModule} from '@angular/router';
import {ButtonExampleComponent} from './button-example/button-example.component';
import {SingleSelectExampleComponent} from './single-select-example/single-select-example.component';
import {FormsModule} from '@angular/forms';

export class customSingleSelectOptions extends admUI.SingleSelectConfig {
  server = 'https://restcountries.eu/rest/v2';
  enablePagination = false;

  // requestHeaders = {
  //   Authorization: ''
  // };

  responseMapFn(el) {
    return {
      label: el.title || el.name,
      value: `${ el.id || el.alpha2Code}`
    }
  }
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
    BrowserModule,
    FormsModule
  ],
  providers: [
    {provide: admUI.SingleSelectConfig, useClass: customSingleSelectOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
