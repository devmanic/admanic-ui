import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './component.selector';
import { Calendar } from './service.calendar';
import { AdmDateRangePickerContainer } from './component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [DateRangePickerComponent, AdmDateRangePickerContainer],
    exports: [DateRangePickerComponent, AdmDateRangePickerContainer],
    providers: [Calendar]
})
export class DateRangePickerModule {
}

