import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, Output,
    ViewEncapsulation, forwardRef
} from '@angular/core';
import { Select2File } from './select2/index';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
declare const $: any;

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
}


const MULTISELECT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MultiSelectComponent),
    multi: true
};

@Component({
    selector: 'adm-multi-select, adm-select[multi]',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.adm-multi-select]': 'true',
        '[class.is-hide-selected]': '_isHideSelected',
        '[class.is-show-count]': '_isShowSelectedCount',
        '[class.with-add-new-btn]': '_showAddNewBtn',
        '[class.is-open]': '_isOpen'
    },
    styleUrls: ['styles.scss'],
    providers: [MULTISELECT_VALUE_ACCESSOR],
    template: `
        <select></select>
        <div class="adm-multi-select__dropdown">
            <div class="adm-multi-select__dropdown-wrap"></div>
            <button *ngIf="_showAddNewBtn" (mousedown)="onAddNewBtnClick($event)" class="adm-multi-select__add-new-btn"
                    type="button">
                <i class="material-icons">add</i> Add new
            </button>
        </div>
    `
})
export class MultiSelectComponent implements AfterViewInit {
    _selectEl: any;
    _defaultParams: MultiselectParams = {};
    _params: MultiselectParams = this._defaultParams;
    _model: string[] = [];
    _isShowSelectedCount: boolean;
    _isHideSelected: boolean;
    _showAddNewBtn: boolean;
    _isOpen: boolean;

    @Input()
    set params(params: MultiselectParams) {
        if (this._selectEl && this._selectEl.hasClass('select2-hidden-accessible')) {
            this._selectEl.select2('destroy');
        }

        this._params = {
            ...this._defaultParams,
            ...this._params,
            ...params,
            data: params.data ? params.data.map(opt => {
                return {
                    id: opt.value || opt.id,
                    text: opt.label || opt.text
                };
            }) : [],
            allowClear: !!this._params.showSelectedCount
        };
        setTimeout(() => {
            this._showAddNewBtn = params.showAddNewBtn;
        }, 1);
        if (this._selectEl) {
            this._selectEl.select2(this._params);
        }
    };

    @Input()
    set options(defaults: { value: string, label: string }[]) {
        setTimeout(() => {
            if (defaults && Array.isArray(defaults)) {
                this.params = {...this._params, data: defaults};
            }
        }, 1);
    };

    @Output() change = new EventEmitter();
    @Output() open = new EventEmitter();
    @Output() opening = new EventEmitter();
    @Output() close = new EventEmitter();
    @Output() closing = new EventEmitter();
    @Output() select = new EventEmitter();
    @Output() selecting = new EventEmitter();
    @Output() unselect = new EventEmitter();
    @Output() unselecting = new EventEmitter();
    @Output() onAddClick = new EventEmitter();


    onChange: Function = (_: any) => {
    };
    onTouched: Function = () => {
    };

    constructor(private el: ElementRef) {

    }

    init() {
        this._selectEl = $(this.el.nativeElement.querySelector('select'));
        this._defaultParams = {
            multiple: true,
            dropdownParent: $(this.el.nativeElement).find('.adm-multi-select__dropdown-wrap'),
            placeholder: 'Select'
        };
        this.params = this._defaultParams;
    }

    ngAfterViewInit() {
        this.init();
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
            this._isOpen = true;
        });
        this._selectEl.on('select2:opening', (event) => {
            this.opening.emit(event);
        });
        this._selectEl.on('select2:close', (event) => {
            this.close.emit(event);
            this._isOpen = false;
        });
        this._selectEl.on('select2:closing', (event) => {
            this.closing.emit(event);
        });
        this._selectEl.on('select2:select', (event) => {
            if (this._params.orderByInput) {
                let $element = $(event.params.data.element);
                $element.detach();
                $(event.currentTarget).append($element);
                $(event.currentTarget).trigger('change');
            }

            this.select.emit([event, this._model]);
        });
        this._selectEl.on('select2:selecting', (event) => {
            this.selecting.emit(event);
        });
        this._selectEl.on('select2:unselect', (event) => {
            this.unselect.emit([event, this._model]);
        });
        this._selectEl.on('select2:unselecting', (event) => {
            this.unselecting.emit(event);
        });
    }

    showSelectedCountFn(e: Event) {
        $(e.currentTarget).parent().find('.select2-search.select2-search--inline .select2-selection__choice').remove();
        if (this._model && this._model.length > this._params.showSelectedCount) {
            this._isShowSelectedCount = true;
            $(e.currentTarget)
                .parent()
                .find('.select2-search.select2-search--inline')
                .prepend(`<span class='select2-selection__choice'><span class='select2-selection__choice__remove select2-selection__clear'>×</span> ${this._model.length} items selected </span>`);
        } else {
            this._isShowSelectedCount = false;
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
                this._model = value;
                this.onChange(this._model);

                if (value !== undefined && this._selectEl !== undefined && trigger) {
                    this._selectEl.val(this._model).trigger('change');
                }
                resolve();
            }, 2);
        });
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }

    onAddNewBtnClick(e) {
        this.onAddClick.emit(e);
    }
}