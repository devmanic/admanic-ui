import _ from 'lodash';
import uuid from 'uuid';
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
import { Http, Response } from '@angular/http';
import { ListRequest } from '../shared/list-request.model';
import { ListRequestService } from '../shared/list-request.service';
import { ErrorHandler } from '../shared/error-handler.service';
import { CustomValidators } from '../validator/validator.service';

interface OptionModel {
    value: string | number;
    label: string;
    hidden?: boolean;
    selected?: boolean;
}

interface AjaxParams {
    path: string;
    options?: ListRequest;
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
    public server = SERVER || '';

    public _value = false;
    @Input() public options: OptionModel[] | any = [];
    @Input() public set value(val) {
        this._value = val;
        this.onChange(val);
        this.onTouched();
    };
    public get value() {
        return this._value;
    }
    @Input() public placeholder: string = 'Select option';
    @Input() public allowClear: boolean = false;
    @Input() public allowCreateEntity: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public entityName: string = 'item';
    @Input() public ajax: AjaxParams = null;
    @Input() public showAddNewBtn: boolean = false;

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

    public pendingRequest: boolean = false;

    private originalPlaceholder;
    private id = uuid.v4();
    private _subscribers: Subscription[] = [];

    private isAjax: boolean = false;
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

    public initAjax(params: AjaxParams) {
        if (params) {
            this.isAjax = true;
        }
    }

    public ngOnDestroy() {
        this._subscribers.forEach((s) => s.unsubscribe());
    }

    public onChange: any = () => {
        //
    }

    public onTouched: any = () => {
        //
    }

    public registerOnChange(fn) {
        this.onChange = fn;
    }

    public registerOnTouched(fn) {
        this.onTouched = fn;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes._options && changes._options.currentValue && changes._options.currentValue.length) {
            let selected = changes._options.currentValue.filter((el: OptionModel) => el.selected)[0];
            if (selected) {
                this.writeValue(selected.value);
            }
        }
    }

    public clearSelection(e: Event = new Event('')) {
        e.preventDefault();
        this.queryStr.setValue('');
        this.value = undefined;
        this.options = this.options.map((option: OptionModel) => {
            option.selected = false;
            option.hidden = false;
            return option;
        });
        this.selected.emit(this.selectedItem);
    }

    public writeValue(value, isSelect = false) {
        if (value || value === null || value == '0') {
            this.value = value;
            let selectedOption: OptionModel = this.options.filter((option: OptionModel) => value == option.value)[0];
            this.selectedItem = selectedOption;

            if (!selectedOption || !(selectedOption.label || selectedOption.value)) {
                return;
            }

            let label = selectedOption.label.toString().split(this.newItemPostfix)[0];
            this.queryStr.setValue(label);
            this.options = this.options.map((option: OptionModel) => {
                return Object.assign(option, {selected: option.value == value ? true : false, hidden: false});
            });
            if (isSelect) {
                this.selected.emit(selectedOption);
            }
        } else {
            this.queryStr.setValue('');
            this.value = false;
            this.options = this.options.map((option: OptionModel) => {
                return Object.assign(option, {selected: false});
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
            this.options = [].concat(
                this.options.filter((option: OptionModel) => option.value != newOption.value),
                [newOption]
            );
            this.writeValue(newOption.value);
            this.newEntityAdd.emit(newOption.label.split(this.newItemPostfix)[0]);
        }
    }

    public get nothingNotFound(): boolean {
        return this.options.every((option) => option.hidden);
    }

    public onAddNewBtnClick(e: Event = new Event('')) {
        this.onAddClick.emit(e);
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
            delete params.query;
        }

        return this.http.get(this.server + `/${this.ajax.path}/list` + ListRequestService.parseRequestObject(params))
            .map((res: Response) => res.json().data)
            .catch((err, caught) => this.errorHandler.handle(err, caught))
            .finally(() => this.pendingRequest = false);
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
        this.options = this.options.map((option: OptionModel) => {
            return Object.assign(option, {
                hidden: (option.label.toLowerCase().indexOf(this.queryStr.value.toLowerCase()) === -1)
            });
        });
    }

    private showValueLabelOnEmptyQuery() {
        if (this.queryStr.value === '') {
            let option = _.find(this.options, (item: any) => item.value == this.value);
            if (option) {
                this.queryStr.setValue(option.label);
            }
        }
    }
}
