import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    Output,
    OnChanges, SimpleChanges
} from '@angular/core';
import {
    ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from '../validator/validator.service';
import { Http, Response } from '@angular/http';
import { ListRequest } from '../../shared/list-request.model';
import { ListRequestService } from '../../shared/list-request.service';
import { ErrorHandler } from '../../shared/error-handler.service';
import { Observable } from 'rxjs/Observable';
import { ArrayUtils } from '../../shared/array.utlis';

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

export interface AjaxParams {
    path: string;
    options?: ListRequest;
}

export const newEntityLen: number = 3;
@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZelectComponent),
            multi: true
        }
    ],
    selector: 'zelect',
    styleUrls: ['./zelect.style.scss'],
    templateUrl: 'zelect.template.html'
})
export class ZelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit, OnChanges {
    isOpen: boolean = false;
    newItemPostfix: string;
    server = '';
    hasGroups: boolean = false;
    invalidQueryString: boolean = false;

    @Input('options') _options: Array<OptionModel | OptionWithGroupModel> = [];
    @Input('value') _value = false;
    @Input() placeholder: string = 'Select option';
    @Input() allowClear: boolean = false;
    @Input() allowCreateEntity: boolean = false;
    @Input() disabled: boolean = false;
    @Input() entityName: string = 'item';
    @Input() ajax: AjaxParams = null;
    @Input() showAddNewBtn: boolean = false;

    get options() {
        return this._options;
    }

    set options(options: OptionModel[] | any) {
        this._options = options;
    }

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    @Output() newEntityAdd = new EventEmitter();
    @Output() show = new EventEmitter();
    @Output() hide = new EventEmitter();
    @Output() selected = new EventEmitter();
    @Output() onAddClick = new EventEmitter();

    queryStr: FormControl = new FormControl(null, [
        Validators.minLength(newEntityLen),
        Validators.maxLength(100),
        CustomValidators.ZelectQueryValidator()
    ]);
    form: FormGroup = new FormGroup({
        queryStr: this.queryStr
    });

    originalPlaceholder;
    id = Date.now();
    _subscribers: Subscription[] = [];

    isAjax: boolean = false;
    pendingRequest: boolean = false;
    ajaxTimeout: any = null;

    baseAjaxOptions: ListRequest = {
        filter: 'active'
    };

    selectedItem: OptionModel = null;


    constructor(public http: Http, public errorHandler: ErrorHandler) {
        this.subscribeToQueryStringChange();
    }

    ngAfterViewInit() {
        this.newItemPostfix = ` (New ${this.entityName} will be created)`;
        this.originalPlaceholder = this.placeholder;

        this.initAjax(this.ajax);

        if (this.allowCreateEntity) {
            this.queryStr.statusChanges.subscribe((status: string) => {
                if (this.queryStr.value.length + 1 > newEntityLen) {
                    this.invalidQueryString = (status === 'INVALID');
                } else {
                    this.invalidQueryString = false;
                }
            });
        }
    }

    initAjax(params: AjaxParams) {
        if (params) {
            this.isAjax = true;
        }
    }

    ngOnDestroy() {
        this._subscribers.forEach(s => s.unsubscribe());
    }

    onChange: any = () => {
    };

    onTouched: any = () => {
    };

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes._options && changes._options.currentValue && changes._options.currentValue.length) {
            this.hasGroups = changes._options.currentValue.every((el: any) => el.hasOwnProperty('name'));
            let selected = changes._options.currentValue.filter((el: OptionModel) => el.selected)[0];
            if (selected) {
                this.writeValue(selected.value);
            }
        }
    }

    clearSelection(e: Event = new Event('')) {
        e.preventDefault();
        this.writeValue('');
        this.selected.emit(this.selectedItem);
    }

    writeValue(value, isSelect = false) {
        if (value || value === null || value == '0') {
            this.value = value;

            let array = this.hasGroups ? ArrayUtils.flatMap(this.options, (item: any) => item.values) : this.options;
            let selectedOption: OptionModel = array.filter((option: OptionModel) => value == option.value)[0];
            this.selectedItem = selectedOption;

            if (!selectedOption || !selectedOption.label || !selectedOption.value) {
                this.queryStr.setValue('');
                return;
            }

            let label = this.trimNewItemString(selectedOption.label);
            this.queryStr.setValue(label);

            if (isSelect) {
                this.selected.emit(selectedOption);
            }
        } else {
            this.queryStr.setValue('');
            this.value = null;
            this.selectedItem = null;
            this.options = this.options.map((option: OptionModel) => {
                return Object.assign(option, {selected: false, hidden: false});
            });
        }
    }

    @HostListener('document: click', ['$event'])
    onClickOnDocument(e: Event | any) {
        if (!e.isInputClick || (e.isInputClick && e.inputId != this.id)) {
            this.showValueLabelOnEmptyQuery();
            this.isOpen = false;
            this.hide.emit();
        }
    }

    onSelect(value: any) {
        if (this.isOpen) {
            this.showValueLabelOnEmptyQuery();
            this.isOpen = false;
            this.hide.emit();
        }
        this.writeValue(value, true);
    }

    subscribeToQueryStringChange() {
        this._subscribers.push(this.queryStr.valueChanges.filter(value => !!value || value === '').subscribe(() => {
            this.isAjax ? this.onAjaxFindOptions() : this.filter();
        }));
    }

    onAjaxFindOptions(skipQuery: boolean = false) {
        clearTimeout(this.ajaxTimeout);
        this.ajaxTimeout = setTimeout(() => {
            this.options = [];
            this.sendAjax(skipQuery).toPromise().then(
                (res: any) => this.options = this.mapAjaxToOptions(res),
                (err: any) => this.options = []
            );
        }, 300);
    }

    mapAjaxToOptions(data: any[] = []): OptionModel[] {
        if (this.allowClear && this.queryStr.value === '') {
            this.value = undefined;
        }
        return data.map((el: any) => ({
            label: el.title,
            value: el.id,
            selected: this.queryStr.value === '' && this.allowClear ? false : el.id == this.value
        }));
    }

    sendAjax(skipQuery: boolean = false) {
        this.pendingRequest = true;
        let params = {
            ...this.baseAjaxOptions,
            ...this.ajax.options,
            query: this.queryStr.value
        };

        if (skipQuery) {
            delete params.query;
        }

        return this.http.get(this.server + `/${this.ajax.path}/list` + ListRequestService.parseRequestObject(params))
            .map((res: Response) => res.json().data)
            .catch((err, caught) => this.errorHandler.handle(err, caught))
            .finally(() => this.pendingRequest = false);
    }

    isElSelected(item: OptionModel): boolean {
        if (this.selectedItem) {
            return item.value == this.selectedItem.value;
        }
        return false;
    }

    filter(value: string = this.queryStr.value) {
        if (!this.hasGroups) {
            this.options = this.options.map((item: OptionModel) => ({
                ...item,
                hidden: (item.label.toLowerCase().indexOf(value.toLowerCase()) === -1),
                selected: this.isElSelected(item)
            }));
        } else {
            this.options = this.options.map((option: any) => (
                {
                    name: option.name,
                    hidden: option.values.every((item: OptionModel) => item.label.toLowerCase().indexOf(value.toLowerCase()) === -1),
                    values: option.values.map((item: OptionModel) =>
                        Object.assign(item, {
                            hidden: (item.label.toLowerCase().indexOf(value.toLowerCase()) === -1),
                            selected: this.isElSelected(item)
                        })
                    )
                }
            ));
        }
    }

    inputClick(e: Event | any) {
        e.isInputClick = true;
        e.inputId = this.id;
    }

    startSearch(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        (<HTMLInputElement>e.target).select();
        this.filter('');
        this.isOpen = true;
        this.show.emit();
        if (this.isAjax) {
            this.onAjaxFindOptions(true);
        }
    }

    toggleOpen(e: Event = new Event('')) {
        e.preventDefault();
        this.inputClick(e);
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.filter('');
            this.show.emit();
        } else {
            this.showValueLabelOnEmptyQuery();
            this.hide.emit();
        }
    }

    addNewOption() {
        if (this.queryStr.valid) {
            let newOption: OptionModel = {
                value: '-2',
                label: this.trimNewItemString(this.queryStr.value) + this.newItemPostfix,
                selected: true
            };
            this.options = [].concat(
                this.options.filter((option: OptionModel) => option.value != newOption.value),
                [newOption]
            );
            this.writeValue(newOption.value);
            this.newEntityAdd.emit(this.trimNewItemString(newOption.label));
        }
    }

    get nothingNotFound(): boolean {
        return this.options.every((option: OptionModel) => option.hidden);
    }

    showValueLabelOnEmptyQuery() {
        if (this.selectedItem && this.trimNewItemString(this.queryStr.value) !== this.trimNewItemString(this.selectedItem.label)) {
            this.queryStr.setValue(this.trimNewItemString(this.selectedItem.label));
        }
    }

    trimNewItemString(str: string): string {
        return str.split(this.newItemPostfix)[0].trim();
    }

    onAddNewBtnClick(e: Event = new Event('')) {
        this.onAddClick.emit(e);
    }

    trackListByFn(index: number, item: OptionModel) {
        return item.value;
    }
}
