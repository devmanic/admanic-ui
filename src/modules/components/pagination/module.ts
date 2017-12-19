import { NgModule } from '@angular/core';
import { PaginationComponent } from './component';
import { CommonModule } from '@angular/common';
import { SingleSelectModule } from '../single-select/module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '../text-input/module';


@NgModule({
    imports: [CommonModule, SingleSelectModule, ReactiveFormsModule, FormsModule, InputModule],
    exports: [PaginationComponent],
    declarations: [PaginationComponent],
    providers: []
})
export class PaginationModule {
}
