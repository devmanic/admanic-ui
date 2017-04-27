import _ from 'lodash';
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
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomValidators } from '../../validator/validator.service';
import uuid from 'uuid';
import { Http, Response } from '@angular/http';
import { ListRequest } from '../../shared/list-request.model';
import { ListRequestService } from '../../shared/list-request.service';
import { ErrorHandler } from '../../shared/error-handler.service';

interface OptionModel {
    value: string | number,
    label: string,
    hidden?: boolean,
    selected?: boolean
}

interface AjaxParams {
    path: string,
    options?: ListRequest
}

@Component({
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ZelectComponent),
            multi: true
        }
    ],
    selector: 'zelect',
    templateUrl: 'zelect.template.html'
})
export class ZelectComponent implements ControlValueAccessor, OnDestroy, AfterViewInit, OnChanges {
    public isOpen: boolean = false;
    public newItemPostfix: string;
    public server = SERVER;

    @Input('options') _options: OptionModel[] = [];
    @Input('value') _value = false;
    @Input() placeholder: string = 'Select option';
    @Input() allowClear: boolean = false;
    @Input() allowCreateEntity: boolean = false;
    @Input() disabled: boolean = false;
    @Input() entityName: string = 'item';
    @Input() ajax: AjaxParams = null;
    @Input() showAddNewBtn: boolean = false;

    public get options() {
        return this._options;
    }

    public set options(options: OptionModel[] | any) {
        this._options = options;
    }

    public get value() {
        return this._value;
    }

    public set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    }

    @Output() public newEntityAdd = new EventEmitter();
    @Output() public show = new EventEmitter();
    @Output() public hide = new EventEmitter();
    @Output() public selected = new EventEmitter();
    @Output() public onAddClick = new EventEmitter();

    public queryStr: FormControl = new FormControl('', [
        Validators.minLength(3),
        Validators.maxLength(100),
        CustomValidators.ZelectQueryValidator()
    ]);
    public form: FormGroup = new FormGroup({
        queryStr: this.queryStr
    });

    private originalPlaceholder;
    private id = uuid.v4();
    private _subscribers: Subscription[] = [];

    private isAjax: boolean = false;
    private pendingRequest: boolean = false;
    private ajaxTimeout: any = null;

    private baseAjaxOptions: ListRequest = {
        filter: 'active'
    };

    private selectedItem: OptionModel = null;


    constructor(private http: Http, private errorHandler: ErrorHandler) {

    }

    public ngAfterViewInit() {
        this.newItemPostfix = ` (New ${this.entityName} will be created)`;
        this.originalPlaceholder = this.placeholder;

        this.initAjax(this.ajax);
    }

    private initAjax(params: AjaxParams) {
        if (params) {
            this.isAjax = true;
        }
    }

    public ngOnDestroy() {
        this._subscribers.forEach(s => s.unsubscribe());
    }

    public onChange: any = () => {
    };

    public onTouched: any = () => {
    };

    public registerOnChange(fn) {
        this.onChange = fn;
    }

    public registerOnTouched(fn) {
        this.onTouched = fn;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes._options && changes._options.currentValue && changes._options.currentValue.length) {
            let selected = changes._options.currentValue.filter((el: OptionModel) => el.selected)[0];
            if (selected) {
                this.writeValue(selected.value)
            }
        }
    }

    public clearSelection(e: Event = new Event('')) {
        e.preventDefault();
        this.queryStr.setValue('');
        this.value = undefined;
        this._options = this._options.map((option: OptionModel) => {
            option.selected = false;
            option.hidden = false;
            return option;
        });
        this.selected.emit(this.selectedItem);
    }

    public writeValue(value, isSelect = false) {
        if (value || value === null || value == '0') {
            this.value = value;
            let selectedOption: OptionModel = this._options.filter((option: OptionModel) => value == option.value)[0];
            this.selectedItem = selectedOption;

            if (!selectedOption || !(selectedOption.label || selectedOption.value)) return;

            let label = selectedOption.label.toString().split(this.newItemPostfix)[0];
            this.queryStr.setValue(label);
            this._options = this._options.map((option: OptionModel) => {
                return Object.assign(option, {selected: option.value == value ? true : false, hidden: false})
            });
            if (isSelect) {
                this.selected.emit(selectedOption);
            }
        } else {
            this.queryStr.setValue('');
            this.value = false;
            this.options = this.options.map((option: OptionModel) => {
                return Object.assign(option, {selected: false})
            });
        }
    }

    @HostListener('document: click', ['$event'])
    public onClickOnDocument(e: Event | any) {
        if (!e.isInputClick || (e.isInputClick && e.inputId != this.id)) {
            this.showValueLabelOnEmptyQuery();
            this.isOpen = false;
            this.hide.emit();
        }
    }

    public onSelect(value: any) {
        if (this.isOpen) {
            this.showValueLabelOnEmptyQuery();
            this.isOpen = false;
            this.hide.emit();
        }
        this.writeValue(value, true);
    }

    public onInputKeyUp(e: Event | any = new Event('')) {
        e.preventDefault();
        e.stopPropagation();
        this.isAjax ? this.onAjaxFindOptions() : this.onFilterOptions();
    }

    private onAjaxFindOptions(skipQuery: boolean = false) {
        clearTimeout(this.ajaxTimeout);
        this.ajaxTimeout = setTimeout(() => {
            this.options = [];
            this.sendAjax(skipQuery).toPromise().then(
                (res: any) => this.options = this.mapAjaxToOptions(res),
                (err: any) => this.options = []
            );
        }, 300);
    }

    private mapAjaxToOptions(data: any[] = []): OptionModel[] {
        if (this.allowClear && this.queryStr.value === '') {
            this.value = undefined;
        }
        return data.map((el: any) => ({
            label: el.title,
            value: el.id,
            selected: this.queryStr.value === '' && this.allowClear ? false : el.id == this.value
        }));
    }

    private sendAjax(skipQuery: boolean = false) {
        this.pendingRequest = true;
        let params = {
            ...this.baseAjaxOptions,
            ...this.ajax.options,
            query: this.queryStr.value
        };

        if (skipQuery) {
            delete params.query
        }

        return this.http.get(this.server + `/${this.ajax.path}/list` + ListRequestService.parseRequestObject(params))
            .map((res: Response) => res.json().data)
            .catch((err, caught) => this.errorHandler.handle(err, caught))
            .finally(() => this.pendingRequest = false)
    }

    private onFilterOptions() {
        if (this.allowClear) {
            if (this.queryStr.value === '') {
                this.clearSelection();
            } else {
                this.filter();
            }
        }
        this.filter();
    }

    private filter() {
        this._options = this._options.map((option: OptionModel) => {
            return Object.assign(option, {
                hidden: (option.label.toLowerCase().indexOf(this.queryStr.value.toLowerCase()) === -1)
            })
        });
    }

    public inputClick(e: Event | any) {
        e.isInputClick = true;
        e.inputId = this.id;
    }

    public startSearch(e: Event) {
        e.preventDefault();
        e.stopPropagation();
        this.isOpen = true;
        this.show.emit();
        if (this.isAjax) {
            this.onAjaxFindOptions(true);
        }
    }

    public toggleOpen(e: Event = new Event('')) {
        e.preventDefault();
        this.inputClick(e);
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.show.emit();
        } else {
            this.showValueLabelOnEmptyQuery();
            this.hide.emit();
        }
    }

    public addNewOption() {
        if (this.queryStr.valid) {
            let newOption = {
                value: '-2',
                label: this.queryStr.value.split(this.newItemPostfix)[0] + this.newItemPostfix,
                selected: true
            };
            this._options = [].concat(
                this._options.filter((option: OptionModel) => option.value != newOption.value),
                [newOption]
            );
            this.writeValue(newOption.value);
            this.newEntityAdd.emit(newOption.label.split(this.newItemPostfix)[0]);
        }
    }

    public get nothingNotFound(): boolean {
        return this._options.every(option => option.hidden)
    }

    private showValueLabelOnEmptyQuery() {
        if(this.queryStr.value === '') {
            let option = _.find(this.options, (item: any) => item.value == this.value);
            if(option) {
                this.queryStr.setValue(option.label);
            }
        }
    }

    public onAddNewBtnClick(e: Event = new Event('')) {
        this.onAddClick.emit(e);
    }
}
