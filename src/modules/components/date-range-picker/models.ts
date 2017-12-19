export interface IMonth {
  weeks: any[];
  name: string;
  year: number;
}

export interface IDate {
  start: Date;
  end: Date;
}

export interface IDateRange extends IDate {
  label: string
}
