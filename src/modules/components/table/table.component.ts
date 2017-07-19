import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';

@Component({
    selector: 'table[adm-table]',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.table]': 'true'
    },
    styles: [`
        th i[hidden] {
            display: none;
        }
    `],
    template: `
        <thead>

        <tr class="table__name">
            <th *ngIf="!hideCheckAll">
                <div class="checkbox-table">
                    <adm-input-container>
                        <adm-checkbox
                                (click)="parent.onCheckedAllItem($event)"
                                [(ngModel)]="parent.all_check"
                                [disabled]="parent.isCheckedAllItem()">
                        </adm-checkbox>
                    </adm-input-container>
                </div>
            </th>
            <th *ngFor="let item of _columns; trackBy: trackListByFn;"
                [admColumn]="item.id"
                (click)="parent.onSortBy(item.id)">
                <span class="table-title">{{item.name}}
                    <i class="material-icons"
                       attr.data-arrow_downward="{{parent.activeSortByField === item.id}}"
                       [hidden]="parent.activeSortByField !== item.id || parent.activeSortOrder !== 1">
                        arrow_downward
                    </i>
                    <i class="material-icons"
                       [hidden]="parent.activeSortByField !== item.id || parent.activeSortOrder !== 0">
                        arrow_upward
                    </i>
                </span>
            </th>
        </tr>
        </thead>

        <ng-content></ng-content>

    `
})
export class TableComponent implements OnInit {
    _arr: any[] = [];
    _columns: any[] = [];
    _sortInProgress: boolean;

    @Output() onSortBy: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCheckedAllItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() all_checkChange: EventEmitter<any> = new EventEmitter();

    // @Input() activeSortByField: string;
    // @Input() activeSortOrder: number;
    // @Input() listData: any[] = [];
    // @Input() all_check: boolean = null;

    @Input() parent: any = {};

    @Input() set columns(items) {
        if (!this._arr.length) {
            this._columns = items;
        } else {
            this._sortHeaders(items);
        }
    }

    _sortHeaders(items) {
        let result = [];
        this._arr.forEach((key) => {
            let found = false;
            items = items.filter((item) => {
                if (!found && item.id == key) {
                    result.push(item);
                    found = true;
                    return false;
                } else
                    return true;
            });
        });

        this._columns = result;
    }

    get _columnsShowObj(): any {
        const cols = {};
        this._columns.forEach(el => cols[el.id] = el.checked);
        return cols;
    }

    get hideCheckAll(): boolean {
        if (!this._columns.length || this.parent.all_check === null)
            return true;
        return false;
    }

    addColumnsKey(key) {
        if (this._arr.indexOf(key) === -1) {
            this._arr = [].concat(this._arr, [key]);
            if (!this._sortInProgress)
                setTimeout(() => this._sortHeaders(this._columns), 300);
        }
    }

    trackListByFn(index: number) {
        return index;
    }

    constructor() {
    }

    ngOnInit() {
        this._columns = this.parent.columnsOptions;
    }
}