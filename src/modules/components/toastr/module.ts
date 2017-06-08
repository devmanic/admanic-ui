import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastContainer} from './component';
import {ToastService} from './service';
import {ToastOptions} from './options';

@NgModule({
  imports: [CommonModule],
  declarations: [ToastContainer],
  exports: [ToastContainer],
  entryComponents: [ToastContainer]
})
export class ToastModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ToastModule,
      providers: [ToastService, ToastOptions],
    };
  }
}