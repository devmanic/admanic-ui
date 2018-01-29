export interface OptionModel {
    value: string | number;
    label: string;
    hidden?: boolean;
    selected?: boolean;
}

export interface OptionWithGroupModel {
    name: string;
    values: OptionModel[];
}

export interface AjaxSettings {
    path: string;
    requestParams?: any;
    mapperFn?;
    arrayFormatFn?;
}