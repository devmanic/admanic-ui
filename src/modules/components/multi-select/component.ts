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
    data?: Array<{ value: number | string, label: string, disabled?: boolean }>,
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
    host: {
        '[class.adm-multi-select]': 'true',
        '[class.is-hide-selected]': 'isHideSelected',
        '[class.is-show-count]': 'isShowSelectedCount'
    },
    styleUrls: ['styles.scss'],
    providers: [SELECT2_VALUE_ACCESSOR],
    template: `
        <select></select>
        <div class="adm-multi-select__dropdown"></div>
    `
})
export class MultiSelectComponent implements AfterViewInit {
    _selectEl: any;
    isHideSelected: boolean;

    @Input()
    public set params(params: Select2 | any) {
        if (this._selectEl) {
            this._selectEl.select2('destroy');
        }

        this._params = {
            ...params,
            data: params.data ? params.data.map(opt => {
                return {
                    id: opt.value || opt.id,
                    text: opt.label || opt.text
                };
            }) : [],
            multiple: true,
            allowClear: !!this._params.showSelectedCount,
            dropdownParent: jQuery(this.el.nativeElement).find('.adm-multi-select__dropdown')
        };

        if (this._selectEl) {
            this._selectEl.select2(this._params);
        }
    };

    @Input()
    public set options(defaults: { value: string, label: string }[]) {
        if (defaults && Array.isArray(defaults)) {
            this.params = {...this._params, data: defaults};
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

    public _options: any[] = [];
    private _params: any = {};

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

        this._selectEl.select2(this._params);
        this._selectEl.val(this.model).trigger('change');

        if (!!this._params.showSelectedCount) {
            // this.select2Element.parents('.field-wrapper').addClass('hide-clear-btn');
        }

        this.bindEvents();
    }

    bindEvents() {
        this._selectEl.on('change', (event) => {
            this.writeValue(this._selectEl.val(), false).then(() => {
                if (!!this._params.showSelectedCount) {
                    this.showSelectedCountFn(event);
                }
            });
            this.change.emit(event);
        });
        this._selectEl.on('select2:open', (event) => {
            this.open.emit(event);
            if (this._params.showAddNewBtn === true) {
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

    isShowSelectedCount: boolean = false;

    showSelectedCountFn(e: Event) {
        $(e.currentTarget).parent().find('.select2-search.select2-search--inline .select2-selection__choice').remove();
        if (this.model && this.model.length > this._params.showSelectedCount) {
            this.isShowSelectedCount = true;
            $(e.currentTarget)
                .parent()
                .find('.select2-search.select2-search--inline')
                .prepend(`<span class='select2-selection__choice'><span class='select2-selection__choice__remove select2-selection__clear'>×</span> ${this.model.length} items selected </span>`);
        } else {
            this.isShowSelectedCount = false;
        }
    }

    ngOnDestroy() {
        if (this._selectEl) {
            this._selectEl.select2('destroy');
        }
    }

    writeValue(value: any, trigger: boolean = true): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.model = value;
                this.onChange(this.model);

                if (value !== undefined && this._selectEl !== undefined && trigger) {
                    this._selectEl.val(this.model).trigger('change');
                }
                resolve();
            }, 1);
        });
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }
}