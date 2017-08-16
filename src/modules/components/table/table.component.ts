import { Component, EventEmitter, Input, OnInit, Output,
    ViewEncapsulation
} from '@angular/core';
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
                                (click)="onCheckAllHandler($event);"
                                [(ngModel)]="all_check"
                                (change)="all_checkHandler($event);"
                                [disabled]="isCheckedAllItem">
                        </adm-checkbox>
                    </adm-input-container>
                </div>
            </th>
            <th *ngFor="let item of _columns; trackBy: trackListByFn;"
                [admColumn]="item.id"
                (click)="item.sortable ? columnClickHandler(item.id) : null">
                <span class="table-title">{{item.name}}
                    <template [ngIf]="item.sortable">
                        <i class="material-icons"
                           attr.data-arrow_downward="{{activeSortByField === item.id}}"
                           [hidden]="activeSortByField !== item.id || activeSortOrder !== 1">
                            arrow_downward
                        </i>
                        <i class="material-icons"
                           [hidden]="activeSortByField !== item.id || activeSortOrder !== 0">
                            arrow_upward
                        </i>
                    </template>
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
    hideCheckAll: boolean;
    _columnsShowObj: any = {};

    @Output() onSortBy: EventEmitter<string> = new EventEmitter<string>();
    @Output() onCheckedAllItem: EventEmitter<any> = new EventEmitter<any>();
    @Output() all_checkChange: EventEmitter<any> = new EventEmitter();

    @Input() activeSortByField: string;
    @Input() activeSortOrder: number;
    @Input() listData: any[] = [];
    @Input() all_check: boolean = true;

    @Input()
    set columns(items) {
        const itemsCopy = items.map(el => Object.assign({}, el));
        if (!this._arr.length) {
            this._columns = itemsCopy;
            this._setColumns();
        } else {
            this._sortHeaders(itemsCopy);
        }
    }

    _sortHeaders(items) {
        this._sortInProgress = true;
        setTimeout(() => {
            let result = [];
            this._arr.forEach((key) => {
                let found = false;
                items = items.filter((item) => {
                    if (!found && item.id == key) {
                        result.push(Object.assign({}, item));
                        found = true;
                        return false;
                    } else
                        return true;
                });
            });
            this._sortInProgress = false;
            this._columns = result;
            this._setColumns();
        }, 100);
    }

    _setColumns() {
        this._columnsShowObj = {};
        const obj = {};
        this._columns.forEach(el => obj[el.id] = el.checked);
        this._columnsShowObj = obj;
    }

    addColumnsKey(key) {
        if (this._arr.indexOf(key) === -1) {
            this._arr = [].concat(this._arr, [key]);
            if (!this._sortInProgress)
                this._sortHeaders(this._columns);
        }
    }

    trackListByFn(index: number) {
        return index;
    }

    columnClickHandler(key: string) {
        this.onSortBy.emit(key);
    }

    onCheckAllHandler(e: Event) {
        e.preventDefault();
        this.listData = this.listData.map(el => Object.assign(el, {checked: this.all_check}));
        this.onCheckedAllItem.emit(e);
    }

    all_checkHandler() {
        this.all_checkChange.emit(this.all_check);
    }

    get isCheckedAllItem(): boolean {
        if (this.listData.length) {
            if (_.every(this.listData, ['access.can_trash', true]) || _.every(this.listData, ['access.can_delete', true])) {
                return false;
            }
        }
        return true;
    }

    constructor() {
    }

    ngOnInit() {
    }
}