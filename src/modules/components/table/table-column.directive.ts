import { Component, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TableComponent } from './table.component';

@Directive({
    selector: 'td[admColumn], th[admColumn]',
    host: {
        '[hidden]': '_hide'
    }
})
export class TableColumnComponent implements OnInit {
    @Input() admColumn: any;

    get _hide(): boolean {
        if (!this.table._columnsShowObj.hasOwnProperty(this.admColumn))
            return true;
        return this.table._columnsShowObj[this.admColumn] == false;
    }

    constructor(private table: TableComponent) {
    }

    ngOnInit() {
        this.table.addColumnsKey(this.admColumn);
    }
}