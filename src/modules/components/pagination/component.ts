import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'adm-pagination',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adm-pagination'
    },
    styleUrls: ['./style.scss'],
    template: `
        <table>
            <tr>
                <td *ngIf="!showFullPagination && showDropdown">
                    <adm-input-container [label]="titles.dropdownLabel">
                        <adm-select single [options]="_range" [(ngModel)]="current" style="width: 100px;"
                                    placeholder="Page">
                        </adm-select>
                    </adm-input-container>
                </td>
                <td>
                    <adm-input-container [label]="titles.paginationLabel">
                        <ul class="adm-pagination__list">
                            <template [ngIf]="showPrevDots && !showFullPagination">
                                <li>
                                    <button (click)="setCurrent(1)" [disabled]="current == 1">{{titles.first}}</button>
                                </li>
                                <li>...</li>
                            </template>
                            <template ngFor let-num [ngForOf]="_range" let-i="index" [ngForTrackBy]="trackByFn">
                                <li *ngIf="isShowNum(num.value) || showFullPagination">
                                    <button [class.is__active]="num.value == current" (click)="setCurrent(num.value)">
                                        {{num.label}}
                                    </button>
                                </li>
                            </template>
                            <template [ngIf]="showNextDots && !showFullPagination">
                                <li>...</li>
                                <li>
                                    <button (click)="setCurrent(total)" [disabled]="current == total">{{titles.last}}
                                    </button>
                                </li>
                            </template>
                        </ul>
                    </adm-input-container>
                </td>
            </tr>
        </table>

    `
})
export class PaginationComponent implements OnInit {
    _range: { label, value }[];
    @Input() current: number;
    @Output() currentChange: EventEmitter<number> = new EventEmitter<number>();

    @Input() total: number;
    @Input() visiblePage: number;
    @Input() titles: { first, prev, prevSet, nextSet, next, last, dropdownLabel, paginationLabel } = {
        first: 'First',
        prev: '\u00AB',
        prevSet: '...',
        nextSet: '...',
        next: '\u00BB',
        last: 'Last',
        dropdownLabel: 'Go to page',
        paginationLabel: 'Pagination'
    };
    @Input() showDropdown: boolean = true;

    @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();

    form: FormGroup = new FormGroup({
        model: new FormControl('')
    });


    constructor() {
    }

    getRange(): { label, value }[] {
        this._range = Array.from(Array(this.total).keys()).map(el => ({
            label: (el + 1).toString(),
            value: el + 1
        }));
        return this._range;
    }

    isShowNum(n: number) {
        return (n == this.current) ||
            (n == (this.current + 1)) ||
            (n == (this.current + 2)) ||
            (n == (this.current - 1)) ||
            (n == (this.current - 2));
    }

    ngOnInit() {
        this.getRange();
    }

    trackByFn(item, index) {
        return index;
    }

    get showPrevDots(): boolean {
        return this.current > 3;
    }

    get showNextDots(): boolean {
        return this.current < this.total - 2;
    }

    get showFullPagination(): boolean {
        return this.total < 10;
    }

    setCurrent(n: number) {
        this.current = n;
        this.currentChange.emit(this.current);
        this.onPageChanged.emit(this.current);
        this.getRange();
    }
}