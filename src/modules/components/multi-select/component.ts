///<reference path="../../../../node_modules/@types/jquery/index.d.ts"/>
import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output,
    ViewEncapsulation, forwardRef
} from '@angular/core';
import { Select2File } from './select2/index';
import * as _ from 'lodash';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Select2 {
    placeholder?: string,
    allowClear?: boolean,
    tags?: boolean,
    ajax?: any,
    data?: Array<{ id: number | string, text: string, disabled?: boolean }>,
    disabled?: boolean,
    maximumSelectionLength?: number,
    minimumResultsForSearch?: string,
    tokenSeparators?: Array<string>,
    matcher?: Function,
    language?: string,
    dir?: string,
    theme?: string,
    templateResult?: Function,
    showSelectedCount?: number
}


const SELECT2_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
};

@Component({
    selector: 'adm-multi-select, adm-select[multi]',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['select2/scss/core.scss'],
    providers: [SELECT2_VALUE_ACCESSOR],
    template: `<select></select>`
})
export class MultiSelectComponent implements AfterViewInit {
    _selectEl: any;

    @Input()
    public set options(options: Select2 | any) {
        console.log('options', options)
        this._options = Object.assign({}, Object.assign({}, options, {
                data: options.data ? options.data.map((opt) => {
                    console.log(opt);
                    return {
                        id: opt.value,
                        text: opt.label
                    };

                }) : [],
                multiple: true,
                allowClear: !!this._options.showSelectedCount
            }
        ));

        if (this._selectEl) {
            this._selectEl.select2(this._options);
        }

        console.log('set', this._options);
    };

    @Input()
    public set defaults(defaults: { value: string, label: string }[]) {
        if (defaults && Array.isArray(defaults)) {
            this.options = Object.assign({}, this._options, {
                data: _.union(this._options.data, defaults)
            });
        }
    };

    @Input() orderByInput: boolean = false;

    @Output() public change = new EventEmitter();
    @Output() public open = new EventEmitter();
    @Output() public opening = new EventEmitter();
    @Output() public close = new EventEmitter();
    @Output() public closing = new EventEmitter();
    @Output() public select = new EventEmitter();
    @Output() public selecting = new EventEmitter();
    @Output() public unselect = new EventEmitter();
    @Output() public unselecting = new EventEmitter();
    @Output() public onAddClick = new EventEmitter();

    public _defaults: any[] = [];
    private _options: any = {};

    private model = [];

    public onChange: Function = (_: any) => {
    };
    public onTouched: Function = () => {
    };

    constructor(private el: ElementRef) {
        Select2File.load();
    }

    ngAfterViewInit() {
        this._selectEl = jQuery(this.el.nativeElement.querySelector('select'));

        this._selectEl.select2(this._options);
        this._selectEl.val(this.model).trigger('change');

        if (!!this._options.showSelectedCount) {
            // this.select2Element.parents('.field-wrapper').addClass('hide-clear-btn');
        }

        this.bindEvents();
    }

    bindEvents() {
        this._selectEl.on('change', (event) => {
            this.model = this._selectEl.val();
            this.onChange(this.model);
            this.change.emit(event);

            if (!!this._options.showSelectedCount) {
                this.showSelectedCountFn(event);
            }
        });
        this._selectEl.on('select2:open', (event) => {
            this.open.emit(event);
            if (this._options.showAddNewBtn === true) {
                this.createBtn.append();
            }
        });
        this._selectEl.on('select2:opening', (event) => {
            this.opening.emit(event);
        });
        this._selectEl.on('select2:close', (event) => {
            this.close.emit(event);
        });
        this._selectEl.on('select2:closing', (event) => {
            this.closing.emit(event);
        });
        this._selectEl.on('select2:select', (event) => {
            if (this.orderByInput) {
                let $element = $(event.params.data.element);
                $element.detach();
                $(event.currentTarget).append($element);
                $(event.currentTarget).trigger('change');
            }

            this.select.emit([event, this.model]);
        });
        this._selectEl.on('select2:selecting', (event) => {
            this.selecting.emit(event);
        });
        this._selectEl.on('select2:unselect', (event) => {
            this.unselect.emit([event, this.model]);
        });
        this._selectEl.on('select2:unselecting', (event) => {
            this.unselecting.emit(event);
        });
    }

    get createBtn() {
        let containerSelector: string = '.select2-results';
        let containerEl: any = $(containerSelector);
        let addBtnClassName: string = 'select2__add-new-btn';
        return {
            append: () => {
                containerEl.find(`.${addBtnClassName}`).remove();
                containerEl.append(`<button class="${addBtnClassName}"><i class="material-icons">add</i> Add new</button>`);
                containerEl.find(`.${addBtnClassName}`).on('click', (event) => {
                    this.onAddClick.emit(event);
                });
            }
        };
    }

    showSelectedCountFn(e: Event) {
        let countSelector: string = 'select2--selected-length';
        let hideClass: string = 'hide-options';
        let parentClass: string = 'selection-show';
        let count: number = this.model.length;

        $(e.currentTarget).parent().find(`.${countSelector}`).remove();

        if (count > this._options.showSelectedCount) {
            $(e.currentTarget).parents(`.${parentClass}`).addClass(hideClass);
            $(e.currentTarget)
                .parent()
                .find('.select2-search.select2-search--inline')
                .prepend(`<span class='${countSelector} select2-selection__choice'><span class='choice__remove select2-selection__clear'>×</span> ${count} items selected </span>`);
        } else {
            $(e.currentTarget).parents(`.${parentClass}`).removeClass(hideClass);
        }
    }

    ngOnDestroy() {
        if (this._selectEl) {
            this._selectEl.select2('destroy');
        }
    }

    writeValue(value: any): void {
        this.model = value;
        this.onChange(this.model);
        if (value !== undefined && this._selectEl !== undefined) {
            this._selectEl.val(this.model).trigger('change');
        }
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }
}