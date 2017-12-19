export interface MultiselectParams {
    placeholder?: string;
    allowClear?: boolean;
    tags?: boolean;
    ajax?: any;
    data?: Array<{ value?: number | string, label?: string, disabled?: boolean, id?: number | string, text?: string }>;
    disabled?: boolean;
    maximumSelectionLength?: number;
    minimumResultsForSearch?: string;
    tokenSeparators?: Array<string>;
    matcher?: Function;
    language?: string;
    dir?: string;
    templateResult?: Function;
    showSelectedCount?: number;
    multiple?: boolean;
    dropdownParent?: any;
    showAddNewBtn?: boolean;
    orderByInput?: boolean;
    hideSelected?: boolean;
    width?: string;
}