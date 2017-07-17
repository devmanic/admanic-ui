import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'table[adm-table]',
    styles: [`
        th i[hidden] {
            display: none;
        }
    `],
    template: `
        <tr>
            <th *ngFor="let item of _columns; trackBy: trackListByFn;"
                [admColumn]="item.id"
                (click)="columnClickHandler(item.id)">
                <span class="table-title">{{item.name}}
                    <i class="material-icons"
                       attr.data-arrow_downward="{{activeSortByField === item.id}}"
                       [hidden]="activeSortByField !== item.id || activeSortOrder !== 1">
                        arrow_downward
                    </i>
                    <i class="material-icons"
                       [hidden]="activeSortByField !== item.id || activeSortOrder !== 0">
                        arrow_upward
                    </i>
                </span>
            </th>
        </tr>
        <ng-content></ng-content>
    `
})
export class TableComponent implements OnInit {
    _arr: any[] = [];
    _columns: any[] = [];
    _sortInProgress: boolean;

    @Output() onSortBy: EventEmitter<string> = new EventEmitter<string>();
    @Input() activeSortByField: string;
    @Input() activeSortOrder: number;

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

    columnClickHandler(key: string) {
        this.onSortBy.emit(key);
    }

    constructor() {
    }

    ngOnInit() {
    }
}