import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SampleComponent } from './modules/sample.component';
import { SampleDirective } from './modules/sample.directive';
import { SamplePipe } from './modules/sample.pipe';
import { SampleService } from './modules/sample.service';

export * from './modules/sample.component';
export * from './modules/sample.directive';
export * from './modules/sample.pipe';
export * from './modules/sample.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SampleComponent,
    SampleDirective,
    SamplePipe
  ],
  exports: [
    SampleComponent,
    SampleDirective,
    SamplePipe
  ]
})
export class AdmamicUiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AdmamicUiModule,
      providers: [SampleService]
    };
  }
}
