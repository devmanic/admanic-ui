import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewEncapsulation, ElementRef
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn, Validators
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Http, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ArrayUtils} from '../../shared/array.utlis';
import {Subject} from 'rxjs/Subject';
import {SingleSelectConfig} from './config.service';
import {OptionModel, OptionWithGroupModel, AjaxSettings} from './model';
import {isObject} from 'util';

export const newEntityLen = 3;

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SingleSelectComponent),
            multi: true
        }
    ],
    selector: 'adm-single-select',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.adm-select]': 'true',
        '[class.disabled]': 'disabled',
        '[class.invalid]': '!isQueryStringValid',
        '[class.is-active]': 'isResultsShown',
        '[class.is-drop-up]': 'isShowResultsOnTop',
        '[class.pending-data-load]': '!isDataLoaded',
        '[class.has_value]': '!!value',
        '[class.without_value]': '!value'
    }
})
export class SingleSelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
    _isResultsShown: boolean = false;
    get isResultsShown(): boolean {
        return this._isResultsShown;
    }

    set isResultsShown(value: boolean) {
        this._isResultsShown = !!value;
        this.isResultsShown ? this.onShown.emit() : this.onHidden.emit();
    }

    isWithGroups: boolean = false;
    isShowResultsOnTop: boolean = false;
    isDataLoaded: boolean;
    isQueryStringValid: boolean = false;
    isAjax: boolean = false;
    isPendingRequest: boolean = false;
    isSkipQuery: boolean = false;

    id: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    server: string = this.config.server;
    latestQuery: string;
    newItemPostfix: string;
    originalPlaceholder: string;

    totalItemsInAjaxResponse: number;
    currentAjaxPage: number = 1;

    onSearchModelChange: Subject<KeyboardEvent> = new Subject<KeyboardEvent>();
    searchModel: FormControl = new FormControl(null, [
        Validators.minLength(newEntityLen),
        Validators.maxLength(100),
        this.searchModelValidator()
    ]);
    form: FormGroup = new FormGroup({
        search: this.searchModel
    });

    selectedItem: OptionModel = null;
    subscribers: Subscription[] = [];

    @Input() placeholder: string = this.config.placeholder;
    @Input() allowClear: boolean = this.config.allowClear;
    @Input() entityName: string = this.config.entityName;
    @Input() showAddNewBtn: boolean = this.config.showAddNewBtn;
    @Input() disableSearch: boolean = this.config.disableSearch;
    @Input() allowCreateEntity: boolean = false;
    @Input() disabled: boolean = false;

    _ajax: AjaxSettings;
    @Input()
    set ajax(params: AjaxSettings) {
        setTimeout(() => {
            if (params) {
                this.isDataLoaded = true;
                this._ajax = params;
                this.searchModel.setValue('');
                this._options = [];
            }
            this.isAjax = !!params;
        }, 0);
    }

    get ajax(): AjaxSettings {
        return this._ajax;
    }

    _viewPath: string;
    @Input()
    set viewPath(path: string) {
        this._viewPath = `${location.origin}/${path}`;
    }

    _options: Array<OptionModel | OptionWithGroupModel> = [];
    @Input()
    set options(options: Array<OptionModel | OptionWithGroupModel>) {
        this._options = Array.isArray(options) ? options : [];
        this.isDataLoaded = options === null ? false : true;
        this.isWithGroups = Array.isArray(options) && options.length && options.every((el: OptionModel | OptionWithGroupModel) => {
            return isObject(el) && el.hasOwnProperty('name') && el.hasOwnProperty('values');
        });
        this.setSelectedItem(this._options);
    }

    get options(): Array<OptionModel | OptionWithGroupModel> {
        return this._options;
    }

    get isOptionsNotFound(): boolean {
        return Array.isArray(this._options) && this._options.length ? this._options.every((option: OptionModel) => option.hidden) : true;
    }

    _value: string;
    get value(): string {
        return this._value;
    }

    set value(val: string) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    @Output() onNewEntityCreated: EventEmitter<string> = new EventEmitter();
    @Output() onShown: EventEmitter<void> = new EventEmitter();
    @Output() onHidden: EventEmitter<void> = new EventEmitter();
    @Output() onSelected: EventEmitter<OptionModel> = new EventEmitter();
    @Output() onAddClicked: EventEmitter<Event> = new EventEmitter();
    @Output() onAjaxResponseReceived: EventEmitter<{ total_rows: number }> = new EventEmitter();

    constructor(public http: Http,
                private config: SingleSelectConfig,
                private el: ElementRef) {
    }

    subscribeToSearchModelChange() {
        this.subscribers.push(
            this.onSearchModelChange
                .debounceTime(300)
                .subscribe(($event: KeyboardEvent) => {
                    const isBackspaceOrDelete = ($event.keyCode === 8 || $event.keyCode === 46);
                    if (!!String.fromCharCode($event.keyCode).match(/\w/) || isBackspaceOrDelete) {
                        this.calculateTextAreaHeight();
                        this.isSkipQuery = false;
                        this.isAjax && this.config.requestParamSearchKey ? this.getOptionsFromServer() : this.filterOptions();
                    }
                })
        );
    }

    ngAfterViewInit() {
        this.newItemPostfix = ` (New ${this.entityName} will be created)`;
        this.originalPlaceholder = this.placeholder;
        this.subscribeToSearchModelChange();

        if (this.allowCreateEntity) {
            this.subscribers.push(
                this.searchModel.statusChanges
                    .subscribe((status: string) => {
                        this.isQueryStringValid = this.searchModel.value.length + 1 > newEntityLen ? status === 'VALID' : true;
                    })
            );
        }
        Observable.fromEvent(window, 'resize').debounceTime(300).subscribe(() => this.calculateTextAreaHeight.bind(this));
        this.calculateTextAreaHeight();
    }

    writeValue(value: string | number, isSelect = false) {
        if (!this._options) {
            return;
        }
        if (typeof value === 'string' || typeof value === 'number' && `${value}` !== '') {
            this.value = `${value}`;
            let array = this.isWithGroups ? ArrayUtils.flatMap(this._options, (item: any) => item.values) : this._options;
            let selectedOption: OptionModel = <OptionModel>array.find((option: OptionModel) => this.value === option.value);
            this.selectedItem = selectedOption;

            if (!selectedOption || !selectedOption.hasOwnProperty('label') || !selectedOption.hasOwnProperty('value')) {
                this.searchModel.setValue('');
            } else {
                let label = this.trimLabel(selectedOption.label);
                this.searchModel.setValue(label);

                if (isSelect) {
                    this.onSelected.emit(selectedOption);
                }
            }
        } else {
            this.resetValue();
        }
        this.calculateTextAreaHeight();
    }

    resetValue() {
        this.searchModel.setValue('');
        this.value = null;
        this.selectedItem = null;
    }

    clearSelection(e: Event = new Event('')) {
        e.preventDefault();
        this.resetValue();
        this.onSelected.emit(this.selectedItem);
    }

    setSelectedItem(arr: Array<OptionModel | OptionWithGroupModel>) {
        const selected: OptionModel = <OptionModel>arr.find((el: OptionModel) => el.value === this.value);
        if (selected) {
            this.selectedItem = selected;
        }
    }

    selectItemHandler(value: string | number) {
        if (!this.selectedItem || this.selectedItem.label !== this.searchModel.value) {
            this.latestQuery = this.searchModel.value;
        }
        this.writeValue(value, true);
        if (this.isResultsShown) {
            this.isResultsShown = false;
        }
    }

    loadMoreOptionsFromServer() {
        this.sendRequest(this.currentAjaxPage + 1).toPromise()
            .then((res) => {
                this.totalItemsInAjaxResponse = res.total_rows;
                this._options = [].concat(this._options, this.responseMapper(res));
                this.setSelectedItem(this._options);
            });
    }

    getOptionsFromServer() {
        this.sendRequest().toPromise().then(
            (res: any) => {
                this._options = this.responseMapper(res);
                this.totalItemsInAjaxResponse = res.total_rows;
                this.onAjaxResponseReceived.emit({total_rows: this.totalItemsInAjaxResponse});
                this.setSelectedItem(this._options);
            },
            () => this._options = []
        );
    }

    getRequestParams(params: any = {}): RequestOptions {
        if (this.config.enablePagination) {
            params.page = this.currentAjaxPage;
            params[this.config.requestParamLimitKey] = 100;
        }

        for (const key of Object.keys(params)) {
            const value = params[key];
            if (typeof value === 'string') {
                value.trim();
            }
            if (value === null || value === '' || value === undefined) {
                delete params[key];
            }
        }
        const requestOptions = new RequestOptions();
        requestOptions.params = params;

        if (this.config.requestHeaders) {
            requestOptions.headers = this.config.requestHeaders;
        }
        return requestOptions;
    }

    sendRequest(page = 1) {
        this.isPendingRequest = true;
        this.isDataLoaded = false;
        this.currentAjaxPage = page;
        const params = {
            ...this.config.requestParams,
            ...this.ajax.requestParams
        };

        if (this.config.requestParamSearchKey) {
            params[this.config.requestParamSearchKey] = this.isSkipQuery ? this.latestQuery : this.searchModel.value;
        }

        return this.http.get(`${this.server}/${this.ajax.path}`, this.getRequestParams(params))
            .map((res: Response) => res.json())
            .finally(() => {
                this.isPendingRequest = false;
                this.isDataLoaded = true;
            });
    }

    responseMapper(res: { data: any[] }): OptionModel[] {
        const arrayInField = this.config.responseArrayKey &&
            res.hasOwnProperty(this.config.responseArrayKey) &&
            Array.isArray(res[this.config.responseArrayKey]);

        let arr = arrayInField ? res[this.config.responseArrayKey] : Array.isArray(res) ? res : [];

        if (this.ajax.hasOwnProperty('arrayFormatFn') && typeof this.ajax.arrayFormatFn === 'function') {
            arr = this.ajax.arrayFormatFn(arr);
            if (!arr || !Array.isArray(arr)) {
                return [];
            }
        }

        const hasCustomResponseMapper = this.ajax.hasOwnProperty('mapperFn') && typeof this.ajax.mapperFn === 'function';
        return arr.map(hasCustomResponseMapper ? this.ajax.mapperFn : this.config.responseMapFn.bind(this));
    }

    filterOptions(value: string = this.searchModel.value) {
        if (value !== null || Array.isArray(this._options)) {
            this.isWithGroups ? this.filterOptionsWithGroup(value) : this.filterFlatOptions(value)
        }
    }

    filterFlatOptions(value: string) {
        this._options = this._options.map((item: OptionModel) => ({
            ...item,
            hidden: (item.label !== null ? item.label.toLowerCase().indexOf(value.toLowerCase()) === -1 : false)
        }));
    }

    filterOptionsWithGroup(value: string) {
        this._options = this._options.map((option: any) => (
            option.values ? {
                name: option.name,
                hidden: option.values.every((item: OptionModel) => item.label.toLowerCase().indexOf(value.toLowerCase()) === -1),
                values: option.values.map((item: OptionModel) =>
                    Object.assign(item, {
                        hidden: (item.label !== null ? item.label.toLowerCase().indexOf(value.toLowerCase()) === -1 : false)
                    })
                )
            } : option
        ));
    }

    showResults(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        if (!this.isResultsShown) {
            if (!this.disableSearch) {
                (<HTMLInputElement>e.target).select();
            }
            this.filterOptions('');
            this.calculateResultsPosition();
            this.isResultsShown = true;
            if (this.isAjax) {
                this.isSkipQuery = true;
                this.getOptionsFromServer();
            }
        }
        // todo: scroll to selected item
    }

    toggleResults(e: Event = new Event('')) {
        e.preventDefault();
        this.inputClickHandler(e);
        this.isResultsShown = !this.isResultsShown;
        if (this.isResultsShown) {
            this.filterOptions('');
            this.calculateResultsPosition();
        } else {
            this.setSelectedItemToSearchModel();
        }
    }

    addNewEntityToOptions() {
        if (this.searchModel.valid) {
            let newOption: OptionModel = {
                value: '-2',
                label: this.trimLabel(this.searchModel.value) + this.newItemPostfix
            };
            this._options = [].concat(
                this._options.filter((option: OptionModel) => option.value !== newOption.value),
                [newOption]
            );
            this.writeValue(newOption.value);
            this.onNewEntityCreated.emit(this.trimLabel(newOption.label));
            this.isDataLoaded = true;
        }
    }

    setSelectedItemToSearchModel() {
        if (this.selectedItem && this.trimLabel(this.searchModel.value) !== this.trimLabel(this.selectedItem.label)) {
            this.searchModel.setValue(this.trimLabel(this.selectedItem.label));
            this.calculateTextAreaHeight();
        }
    }

    trimLabel(str: string): string {
        if (str !== null) {
            return `${str}`.split(this.newItemPostfix)[0].trim();
        }
        return '';
    }

    calculateResultsPosition() {
        this.isShowResultsOnTop = this.el.nativeElement.getBoundingClientRect().top + 165 > window.innerHeight;
    }

    calculateTextAreaHeight() {
        const el = this.el.nativeElement.querySelector('textarea');
        el.style.cssText = `height:auto`;
        el.style.cssText = `height:${el.scrollHeight}px`;
    }

    enterClickHandler(e: Event) {
        const value = (<HTMLInputElement>e.target).value;
        if (!this.isWithGroups && value) {
            const foundedItem: OptionModel = <OptionModel>this._options.find((el: OptionModel) => el.value === value);
            if (foundedItem) {
                this.selectItemHandler(foundedItem.value);
            }
        }
    }

    enterKeydownHandler(e: Event) {
        e.preventDefault();
    }

    inputClickHandler(e: Event | any) {
        e.isInputClick = true;
        e.inputId = this.id;
    }

    resultsClickHandler($event: Event) {
        $event.stopPropagation();
        $event.preventDefault();
    }

    @HostListener('document: click', ['$event'])
    documentClickHandler(e: Event | any) {
        if (!e.isInputClick || (e.isInputClick && e.inputId !== this.id)) {
            this.setSelectedItemToSearchModel();
            this._isResultsShown = false;
        }
    }

    ngOnDestroy() {
        this.subscribers.forEach(s => s.unsubscribe());
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

    trackListByFn(index: number) {
        return index;
    }

    searchModelValidator(): ValidatorFn {
        let pattern = /^[\w\s-,._\/*]+$/;
        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched) || !control.value) {
                return null;
            } else {
                return pattern.test(control.value) ? null : {stringPattern: false};
            }
        };
    }
}
