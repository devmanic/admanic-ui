import {
    ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'adm-pagination',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adm-pagination',
        'aria-label': 'Page navigation'
    },
    styleUrls: ['./style.scss'],
    template: `
        <table>
            <tr>
                <td *ngIf="!showFullPagination && showDropdown">
                    <adm-input-container [label]="titles.dropdownLabel" class="adm-pagination__dropdown">
                        <adm-select single [options]="_range" [(ngModel)]="current"
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
                                    <button (click)="setCurrent(totalBtns)" [disabled]="current == totalBtns">
                                        {{titles.last}}
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
    _total: number;
    @Input() current: number;
    @Output() currentChange: EventEmitter<number> = new EventEmitter<number>();

    @Input()
    set total(n: number) {
        this._total = n;
        this.getRange();
    }

    get total(): number {
        return this._total;
    }

    @Input() visiblePage: number;
    @Input() titles: { first, prev, prevSet, nextSet, next, last, dropdownLabel, paginationLabel } = {
        first: 'First',
        prev: '\u00AB',
        prevSet: '...',
        nextSet: '...',
        next: '\u00BB',
        last: 'Last',
        dropdownLabel: '',
        paginationLabel: ''
    };
    @Input() showDropdown: boolean = true;
    @Input() itemsPerPage: number;

    @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();

    form: FormGroup = new FormGroup({
        model: new FormControl('')
    });


    constructor() {
    }

    get totalBtns(): number {
        return Math.ceil(this.total / this.itemsPerPage);
    }

    getRange() {
        this._range = Array.from(Array(this.totalBtns ? this.totalBtns : 0).keys()).map(el => ({
            label: (el + 1).toString(),
            value: el + 1
        }));
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
        return this.current < this.totalBtns - 2;
    }

    get showFullPagination(): boolean {
        return this.totalBtns < 10;
    }

    setCurrent(n: number) {
        this.current = n;
        this.currentChange.emit(this.current);
        this.onPageChanged.emit(this.current);
        this.getRange();
    }

    //sadsahhkjhkjh
}