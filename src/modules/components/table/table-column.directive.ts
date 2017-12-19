import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TableComponent } from './table.component';

@Directive({
    selector: 'td[admColumn], th[admColumn]',
    host: {
        '[hidden]': '_hide'
    }
})
export class TableColumnComponent implements OnInit {
    @Input() admColumn: any;
    isThead: boolean;

    get _hide(): boolean {
        if (!this.table._columnsShowObj.hasOwnProperty(this.admColumn))
            return true;
        return this.table._columnsShowObj[this.admColumn] == false;
    }

    constructor(private table: TableComponent, el: ElementRef) {
        this.isThead = el.nativeElement.tagName.toLowerCase() === 'th';
    }

    ngOnInit() {
        if (!this.isThead) {
            this.table.addColumnsKey(this.admColumn);
        }
    }
}