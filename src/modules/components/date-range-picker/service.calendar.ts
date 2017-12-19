import { Injectable } from '@angular/core';
import { IDate, IMonth } from "./models";

@Injectable()
export class Calendar {
  firstWeekDay = 0;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'
  ];

  dayNames: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  getMonthName(i: number): string {
    return this.months[i];
  }

  getMonthNum(name: string): number | string {
    const i = this.months.indexOf(name) + 1;
    if (i !== -1) {
      return ('0' + i).slice(-2);
    }
    return 0;
  }

  weekStartDate(date: Date) {
    const startDate = new Date(date.getTime());
    while (startDate.getDay() !== this.firstWeekDay) {
      startDate.setDate(startDate.getDate() - 1);
    }
    return startDate;
  }

  monthDates(year: number, month: number, dayFormatter: any = null, weekFormatter: any = null) {
    if ((typeof year !== 'number') || (year < 1970)) {
      throw new Error(('year must be a number >= 1970'));
    }

    if ((typeof month !== 'number') || (month < 0) || (month > 11)) {
      throw new Error(('month must be a number (Jan is 0)'));
    }

    const weeks: any[] = [];
    let week: any[] = [];
    let i = 0;
    let date = this.weekStartDate(new Date(year, month, 1));
    do {
      for (i = 0; i < 7; i++) {
        week.push(dayFormatter ? dayFormatter(date) : date);
        date = new Date(date.getTime());
        date.setDate(date.getDate() + 1);
      }
      weeks.push(weekFormatter ? weekFormatter(week) : week);
      week = [];
    } while ((date.getMonth() <= month) && (date.getFullYear() === year));
    return weeks;
  }

  monthDays(year: number, month: number) {
    const getDayOrZero = function getDayOrZero(date: any) {
      return date.getMonth() === month ? date : 0;
    };
    return this.monthDates(year, month, getDayOrZero);
  }

  getMonth(date: Date): IMonth {
    const monthN = date.getMonth();
    const year = date.getFullYear();
    return {
      weeks: [].concat([], this.monthDays(year, monthN)),
      name: this.getMonthName(monthN),
      year
    };
  }

  isDate(date: Date): boolean {
    return !!date && date instanceof Date;
  }

  isModelValid(model: IDate) {
    return !!model &&
      model.hasOwnProperty('start') && model.hasOwnProperty('end') &&
      this.isDate(model.start) && this.isDate(model.end);
  }

  get today(): Date {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

}
