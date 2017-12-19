import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { TableColumnComponent } from './table-column.directive';
import { InputModule } from '../text-input/module';
import { CheckboxAndRadioModule } from '../checkbox/module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, InputModule, CheckboxAndRadioModule, FormsModule, ReactiveFormsModule],
    exports: [TableComponent,TableColumnComponent],
    declarations: [TableComponent, TableColumnComponent],
    providers: []
})
export class TableModule {

}
