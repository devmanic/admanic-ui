import {
    AfterViewInit,
    Component,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    Output,
    ViewEncapsulation, ElementRef, OnInit
} from '@angular/core';
import {
    ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from '../validator/service';
import { Http, Response } from '@angular/http';
import { ListRequest } from '../../shared/list-request.model';
import { ListRequestService } from '../../shared/list-request.service';
import { ErrorHandler } from '../../shared/error-handler.service';
import { Observable } from 'rxjs/Observable';
import { ArrayUtils } from '../../shared/array.utlis';

declare const SERVER: string;

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
    fullpath?: boolean
}

export const newEntityLen: number = 3;

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SingleSelectComponent),
            multi: true
        }
    ],
    selector: 'adm-single-select, adm-select[single]',
    styleUrls: ['./style.scss'],
    templateUrl: './template.html',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.adm-select]': 'true',
        '[class.disabled]': 'disabled',
        '[class.invalid]': 'invalidQueryString',
        '[class.is-active]': 'isOpen',
        '[class.is-drop-up]': 'showToTop',
        '[class.pending-data-load]': '!_dataLoaded',
        '[class.has_value]': '!!value',
        '[class.without_value]': '!value'
    }
})
export class SingleSelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit {
    isOpen: boolean = false;
    newItemPostfix: string;
    server = SERVER || '';
    hasGroups: boolean = false;
    invalidQueryString: boolean = false;
    showToTop: boolean = false;
    _options: Array<OptionModel | OptionWithGroupModel> = [];
    _dataLoaded: boolean;
    queryChangeSubscription: Subscription;
    latestQuery: string = '';
    _viewPath: string;

    _totalItemsInAjaxResponse: string | number;
    _currentAjaxPage: number = 1;

    @Input('value') _value: any = false;
    @Input() placeholder: string = 'Select option';
    @Input() allowClear: boolean = false;
    @Input() allowCreateEntity: boolean = false;
    @Input() disabled: boolean = false;
    @Input() entityName: string = 'item';
    @Input() ajax: AjaxParams = null;
    @Input() showAddNewBtn: boolean = false;

    @Input()
    set viewPath(path) {
        this._viewPath = `${location.origin}/${path}`;
    };

    get options() {
        return this._options;
    }

    @Input()
    set options(options: Array<OptionModel | OptionWithGroupModel>) {
        if (options && Array.isArray(options)) {
            this._options = this.value ?
                options.map((el: OptionModel) => Object.assign({}, el, {selected: el.value == this.value})) :
                options;

            let selected = this._options.filter((el: OptionModel) => el.selected)[0];
            if (selected)
                this.writeValue(selected['value']);

            this._dataLoaded = true;
            this.hasGroups = this._options.length && this._options.every((el: any) => el.hasOwnProperty('name'));
        } else if (options === null) {
            this._dataLoaded = false;
            this._options = [];
            this.hasGroups = false;
        }
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


    constructor(public http: Http, public errorHandler: ErrorHandler, private el: ElementRef) {
        // this.subscribeToQueryStringChange();
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

        Observable.fromEvent(window, 'resize').subscribe(() => {
            this.calculateTextareaHeight();
        });

        setTimeout(() => {
            this.calculateTextareaHeight();
        }, 100);
    }

    initAjax(params: AjaxParams) {
        if (params) {
            this.isAjax = true;
            this._dataLoaded = true;
            // if (this.value) {
            //     this.onAjaxFindOptions();
            // }
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

    clearSelection(e: Event = new Event('')) {
        e.preventDefault();
        this.writeValue('');
        this.selected.emit(this.selectedItem);
    }

    writeValue(value, isSelect = false) {
        if (!this._options) {
            return;
        }
        this.unsubscribeFromQueryStringChange();
        if (value || value === null || value == '0') {
            this.value = value;
            let array = this.hasGroups ? ArrayUtils.flatMap(this._options, (item: any) => item.values) : this._options;
            let selectedOption: OptionModel = <OptionModel>array.find((option: OptionModel) => value == option.value);
            this.selectedItem = selectedOption;

            if (!selectedOption || !selectedOption.hasOwnProperty('label') || !selectedOption.hasOwnProperty('value')) {
                this.queryStr.setValue('');
            } else {
                let label = this.trimNewItemString(selectedOption.label);
                this.queryStr.setValue(label);

                if (isSelect) {
                    this.selected.emit(selectedOption);
                }
            }
            this.calculateTextareaHeight();
        } else {
            this.queryStr.setValue('');
            this.calculateTextareaHeight();
            this.value = null;
            this.selectedItem = null;
            this._options = this._options.map((option: OptionModel) => {
                return Object.assign(option, {selected: false, hidden: false});
            });
        }
        this.subscribeToQueryStringChange();
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
        if (!this.selectedItem || this.selectedItem.label != this.queryStr.value) {
            this.latestQuery = this.queryStr.value;
        }
        this.writeValue(value, true);
        if (this.isOpen) {
            this.isOpen = false;
            this.hide.emit();
        }
    }

    subscribeToQueryStringChange() {
        this.unsubscribeFromQueryStringChange();
        setTimeout(() => {
            this.queryChangeSubscription = this.queryStr.valueChanges.filter(value => !!value || value === '').debounceTime(100).subscribe((value) => {
                this.calculateTextareaHeight();
                this.isAjax ? this.onAjaxFindOptions() : this.filter();
            });
        }, 300);
    }

    unsubscribeFromQueryStringChange() {
        if (this.queryChangeSubscription) {
            this.queryChangeSubscription.unsubscribe();
            this.queryChangeSubscription = null;
        }
    }

    onAjaxFindOptions(skipQuery: boolean = false) {
        clearTimeout(this.ajaxTimeout);
        this.ajaxTimeout = setTimeout(() => {
            // this._options = [];
            this.sendAjax(skipQuery).toPromise().then(
                (res: any) => {
                    this._options = res.data.map((el: any) => ({
                        label: el.title || el.text || el.label || el.id,
                        value: el.id,
                        selected: el.id == this.value
                    }));
                    this._totalItemsInAjaxResponse = res.total_rows;
                    const selected: OptionModel = <OptionModel>this._options.filter((el: OptionModel) => el.selected)[0];
                    if (selected) {
                        this.selectedItem = selected;

                        // if (!this.isOpen && this.value) {
                        //     this.writeValue(this.selectedItem.value);
                        // }
                    }
                },
                (err: any) => this._options = []
            );
        }, 300);
    }

    sendAjax(skipQuery: boolean = false, page: number = 1, limit: number = 100) {

        this.pendingRequest = true;
        this._dataLoaded = false;
        this._currentAjaxPage = page;

        let params = {
            query: skipQuery ? this.latestQuery : this.queryStr.value,
            limit,
            page: this._currentAjaxPage,
            ...this.baseAjaxOptions,
            ...this.ajax.options
        };

        // if (skipQuery) {
        //     delete params.query;
        // }

        return this.http.get(this.server + `/${this.ajax.path + (!this.ajax.fullpath ? '/list' : '')}` + ListRequestService.parseRequestObject(params))
            .map((res: Response) => res.json())
            .catch((err, caught) => this.errorHandler.handle(err, caught))
            .finally(() => {
                this.pendingRequest = false;
                this._dataLoaded = true;
            });
    }

    ajaxLoadMoreItems(e: Event) {
        e.preventDefault();
        e.stopImmediatePropagation();

        clearTimeout(this.ajaxTimeout);
        this.ajaxTimeout = setTimeout(() => {
            this.sendAjax(false, this._currentAjaxPage + 1).toPromise().then((res) => {
                this._totalItemsInAjaxResponse = res.total_rows;
                
                this._options = [].concat(this._options, res.data.map((el: any) => ({
                    label: el.title || el.text || el.label || el.id,
                    value: el.id,
                    selected: el.id == this.value
                })));


                const selected: OptionModel = <OptionModel>this._options.filter((el: OptionModel) => el.selected)[0];
                if (selected) {
                    this.selectedItem = selected;
                }
            });
        }, 100);

    }

    isElSelected(item: OptionModel): boolean {
        if (this.selectedItem) {
            return item.value == this.selectedItem.value;
        }
        return false;
    }

    filter(value: string = this.queryStr.value) {
        if (value === null || !this._options) {
            return;
        }
        if (!this.hasGroups) {
            this._options = this._options.map((item: OptionModel) => ({
                ...item,
                hidden: (item.label !== null ? item.label.toLowerCase().indexOf(value.toLowerCase()) === -1 : false),
                selected: this.isElSelected(item)
            }));
        } else {
            this._options = this._options.map((option: any) => (
                option.values ? {
                    name: option.name,
                    hidden: option.values.every((item: OptionModel) => item.label.toLowerCase().indexOf(value.toLowerCase()) === -1),
                    values: option.values.map((item: OptionModel) =>
                        Object.assign(item, {
                            hidden: (item.label !== null ? item.label.toLowerCase().indexOf(value.toLowerCase()) === -1 : false),
                            selected: this.isElSelected(item)
                        })
                    )
                } : option
            ));
        }
    }

    inputClick(e: Event | any) {
        e.isInputClick = true;
        e.inputId = this.id;
    }

    onEnterClick(e: Event) {
        const value = (<HTMLInputElement>e.target).value;
        if (this.hasGroups || !value) return;
        const filtered = this._options.filter((el: OptionModel) => el.value == value);
        if (filtered && filtered[0]) {
            this.onSelect(filtered[0]['value']);
        }
    }

    onEnterKeydown(e: Event) {
        e.preventDefault();
    }

    calculatePosition() {
        this.showToTop = this.el.nativeElement.getBoundingClientRect().top + 165 > window.innerHeight;
    }

    startSearch(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        (<HTMLInputElement>e.target).select();
        this.filter('');
        this.calculatePosition();
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
            this.calculatePosition();
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
            this._options = [].concat(
                this._options.filter((option: OptionModel) => option.value != newOption.value),
                [newOption]
            );
            this.writeValue(newOption.value);
            this.newEntityAdd.emit(this.trimNewItemString(newOption.label));
            this._dataLoaded = true;
        }
    }

    get nothingNotFound(): boolean {
        return this._options && this._options.length ? this._options.every((option: OptionModel) => option.hidden) : true;
    }

    showValueLabelOnEmptyQuery() {
        if (this.selectedItem && this.trimNewItemString(this.queryStr.value) !== this.trimNewItemString(this.selectedItem.label)) {
            this.unsubscribeFromQueryStringChange();
            this.queryStr.setValue(this.trimNewItemString(this.selectedItem.label));
            this.calculateTextareaHeight();
            this.subscribeToQueryStringChange();
        }
    }

    trimNewItemString(str: string): string {
        if (str !== null) {
            return str.split(this.newItemPostfix)[0].trim();
        }
        return '';
    }

    onAddNewBtnClick(e: Event = new Event('')) {
        this.onAddClick.emit(e);
    }

    trackListByFn(index: number, item: OptionModel) {
        return index;
    }

    calculateTextareaHeight() {
        const el = this.el.nativeElement.querySelector('textarea');
        el.style.cssText = `height:auto`;
        el.style.cssText = `height:${el.scrollHeight}px`;
    }
}
