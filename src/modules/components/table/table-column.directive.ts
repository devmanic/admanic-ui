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
        if (!this.table._columns.hasOwnProperty(this.admColumn))
            return true;
        return this.table._columns[this.admColumn] == false;
    }

    constructor(private _el: ElementRef, private table: TableComponent) {
        // console.log(table);
    }

    ngOnInit() {
        // console.log(this._el);
        //asd
    }
}