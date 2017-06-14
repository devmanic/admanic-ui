import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Calendar } from './service.calendar';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { IDate, IMonth, IDateRange } from './models';


export const START_DATE = 'start';
export const END_DATE = 'end';
export type modelTarget = 'start' | 'end';

@Component({
    selector: 'date-range-picker-selector',
    templateUrl: './template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangePickerComponent {
    _initialDate: IDate;
    isHoveredDay: Date;

    firstMonth: IMonth;
    secondMonth: IMonth;
    monthsArr: IMonth[] = [];
    today: Date = this._calendar.today;

    targetDate: modelTarget = START_DATE;
    startDate: FormControl = new FormControl(null);
    endDate: FormControl = new FormControl(null);
    model: FormGroup = new FormGroup({
        [START_DATE]: this.startDate,
        [END_DATE]: this.endDate
    });

    @Input() ranges: IDateRange;
    @Input() format: string;
    @Input() enableReset: boolean;

    @Input() set initialDate(date: IDate) {
        if (this._calendar.isModelValid(date)) {
            this.model.setValue(date);
            this.prepareData(date.start);
            this._initialDate = date;
        }
    }

    @Output() apply: EventEmitter<IDate> = new EventEmitter<IDate>();

    constructor(public _calendar: Calendar) {
        this.prepareData();
    }

    prepareData(date: Date = this.today) {
        this.firstMonth = this._calendar.getMonth(date);
        this.secondMonth = this._calendar.getMonth(moment(date).add('1', 'month').toDate());
        this.monthsArr = [this.firstMonth, this.secondMonth];
    }

    changeMonths(month: IMonth, n: number) {
        this.prepareData( moment(`${this._calendar.getMonthNum(month.name)} 01 ${month.year}`, 'MM DD YYYY').add(n, 'month').toDate() );
    }

    setModel(day: Date) {
        if (!this._calendar.isDate(day)) {
            return;
        }

        if (this.targetDate === START_DATE) {
            this.startDate.setValue(day);
            this.endDate.setValue(null);
            this.targetDate = END_DATE;
        } else {
            if (this.startDate.value && this._calendar.isDate(this.startDate.value) && moment(this.startDate.value).isAfter(day)) {
                this.startDate.setValue(day);
            } else {
                this.endDate.setValue(day);
                this.targetDate = START_DATE;
            }
        }
    }

    setRange(range: any) {
        if (this._calendar.isModelValid(range)) {
            this.startDate.setValue(range.start);
            this.endDate.setValue(range.end);
            this.prepareData(range.start);
            setTimeout(() => {
                this.onApply();
            }, 1);
        }
    }

    reset() {
        this.prepareData();
        this.model.reset();
        this.targetDate = START_DATE;
    }

    setHoveredDay(day: Date) {
        if (this.startDate.value && !this.endDate.value && this._calendar.isDate(day)) {
            this.isHoveredDay = day;
        }
    }

    onApply() {
        if (this._calendar.isModelValid(this.model.value) || (this.startDate.value === null && this.endDate.value === null)) {
            this.apply.emit(this.model.value);
        }
    }

    onCancel() {
        this.apply.emit(this._initialDate);
    }

    formatDate(date: Date) {
        if (!this._calendar.isDate(date)) {
            return 'not selected';
        }
        return moment(date).format(this.format);
    }

    // methods for adding class names
    isToday(day: Date): boolean {
        if (!this._calendar.isDate(day) || !this._calendar.isDate(this.today)) {
            return false;
        }
        return day.toDateString() === this.today.toDateString();
    }

    isStartDate(day: Date): boolean {
        if (!this._calendar.isDate(day) || !this._calendar.isDate(this.startDate.value)) {
            return false;
        }
        return this.startDate.value.toDateString() === day.toDateString();
    }

    isEndDate(day: Date): boolean {
        if (!this._calendar.isDate(day) || !this._calendar.isDate(this.endDate.value)) {
            return false;
        }
        return this.endDate.value.toDateString() === day.toDateString();
    }

    isDayBetweenRange(day: Date) {
        if (!this._calendar.isDate(day) || !this._calendar.isDate(this.startDate.value) || !this._calendar.isDate(this.endDate.value)) {
            return false;
        }
        return moment(day).isBetween(this.startDate.value, this.endDate.value);
    }

    isBetweenStartAndHover(day: Date) {
        if (
            !this._calendar.isDate(day) ||
            !this._calendar.isDate(this.startDate.value) ||
            !this._calendar.isDate(this.isHoveredDay) ||
            this._calendar.isDate(this.endDate.value)
        ) {
            return false;
        }

        return moment(day).isBetween(this.startDate.value, moment(this.isHoveredDay).add('1', 'day'));
    }

    dayClassNames(day): string {
        return `
    ${this.isToday(day) ? 'is__today' : ''} 
    ${this.isStartDate(day) ? 'is__start-date' : ''}
    ${this.isEndDate(day) ? 'is__end-date' : ''}
    ${this.isDayBetweenRange(day) ? 'is__between-range' : ''}
    ${this.isHoveredDay && this.isBetweenStartAndHover(day) ? 'is__between-start-and-hover' : ''}
    `.replace(/\n+/g, '');
    }

    // track by method
    trackByFn(index) {
        return index;
    }

}