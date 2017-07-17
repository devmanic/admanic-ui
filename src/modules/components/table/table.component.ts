import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'table[adm-table]',
    template: `
        <tr>
            <template ngFor let-item [ngForOf]="columns" let-i="index">
                <th [admColumn]="item.id">
                    <span class="table-title">{{item.name}}</span>
                </th>
            </template>
        </tr>
        <ng-content></ng-content>
    `
})
export class TableComponent implements OnInit {
    arr:any[] = [];
    @Input() columns: any;

    get _columns():any{
        const cols = {};
        this.columns.forEach(el => cols[el.id] = el.checked);
        // console.log(cols)
        return cols;
    }

    constructor() {
    }

    ngOnInit() {
        console.log(this.arr)
    }
}