import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';
import { CommonModule } from '@angular/common';
import { TableColumnComponent } from './table-column.directive';

@NgModule({
    imports: [CommonModule],
    exports: [TableComponent,TableColumnComponent],
    declarations: [TableComponent, TableColumnComponent],
    providers: []
})
export class TableModule {

}
