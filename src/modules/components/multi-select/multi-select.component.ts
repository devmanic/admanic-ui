import {
    AfterViewInit, Component, ElementRef, EventEmitter, Input, Output,
    ViewEncapsulation, forwardRef, OnDestroy
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultiselectParams} from './model';

declare const $: any;

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
        '[class.is-open]': '_isOpen && !_isTags',
        '[class.is-tags]': '_isTags',
        '[class.is-above]': '_isAbove',
        '[class.pending-data-load]': '!_dataLoaded'
    },
    styleUrls: ['styles.scss'],
    providers: [MULTISELECT_VALUE_ACCESSOR],
    template: `
        <div class="adm-spinner-container"
             style="transform: none; z-index: 1; right: 5px; left:initial; top: 0; bottom:0; margin: auto;"
             *ngIf="!_dataLoaded">
            <div class="spinner spinner-1"></div>
            <div class="spinner spinner-2"></div>
            <div class="spinner spinner-3"></div>
            <div class="spinner spinner-4"></div>
            <div class="spinner spinner-5"></div>
            <div class="spinner spinner-6"></div>
            <div class="spinner spinner-7"></div>
            <div class="spinner spinner-8"></div>
            <div class="spinner spinner-9"></div>
            <div class="spinner spinner-10"></div>
            <div class="spinner spinner-11"></div>
            <div class="spinner spinner-12"></div>
        </div>
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
export class MultiSelectComponent implements AfterViewInit, OnDestroy {
    writeValueTimeout: any;
    onChangeTimeout: any;
    selectHandlerTimeout: any;

    get jQuery() {
        return $;
    }

    get $select() {
        const el = this.el.nativeElement.querySelector('select');
        return !!this.jQuery && !!el ? this.jQuery(el) : null;
    }

    _defaultParams: MultiselectParams = {width: '100%'};
    _params: MultiselectParams = this._defaultParams;
    _value: string[] = [];
    _isShowSelectedCount: boolean;
    _isHideSelected: boolean;
    _showAddNewBtn: boolean;
    _isOpen: boolean;
    _modelChangedI = 0;
    _hasGroups: boolean;
    _isTags: boolean;
    _isAbove: boolean;
    _notSelect2Instance: boolean;
    _dataLoaded: boolean;

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

    @Input()
    set params(params: MultiselectParams) {
        if (this.$select && this.$select.hasClass('select2-hidden-accessible')) {
            this.$select.select2('destroy');
            this.$select.html(null);
        }

        let data = [];
        if (params.data) {
            if (this._hasGroups) {
                data = params.data.map((opt: any) => ({
                    text: opt.name,
                    children: opt.values.map((el: any) => ({
                        id: el.value || el.id,
                        text: el.label || el.text
                    }))
                }));
            } else {
                data = params.data.map(opt => ({
                    id: opt.value || opt.id,
                    text: opt.label || opt.text
                }));
            }
        }

        this._params = {
            ...this._defaultParams,
            ...this._params,
            ...params,
            data,
            allowClear: true
        };
        setTimeout(() => {
            this._showAddNewBtn = this._params.showAddNewBtn;
            this._isTags = this._params.tags;
            this._isHideSelected = this._params.hideSelected;
        }, 1);

        try {
            this.$select.select2(this._params);
            this.makeDraggable();
        } catch (e) {
            console.warn('select2 not found');
        }

    };

    @Input()
    set options(defaults: { value: string, label: string }[]) {
        setTimeout(() => {
            if (defaults && Array.isArray(defaults)) {
                this._hasGroups = defaults.every((el: any) => el.hasOwnProperty('name'));
                this.params = {...this._params, data: defaults};
                this._dataLoaded = true;
            } else if (defaults === null) {
                this._hasGroups = false;
                this._dataLoaded = false;
                this.params = {...this._params, data: []};
            }
        }, 1);
    };

    get value() {
        return this._value;
    }

    set value(val) {
        this._value = val;
        if (++this._modelChangedI > 1) {
            this.onChange(this._value);
            this.onTouched();
        }
    }

    constructor(private el: ElementRef) {
    }

    makeDraggable() {
        try {
            try {
                this.$select.sortable('destroy');
            } catch (e) {
            }

            const $sortableContainer = this.$select.parent().find('.select2-selection__rendered');
            $sortableContainer.sortable({
                containment: 'parent',
                appendTo: 'body',
                items: '.select2-selection__choice',
                forcePlaceholderSize: true,
                cursor: 'move',
                distance: 5,
                update: () => {
                    const arr = Array.from($sortableContainer.find('.select2-selection__choice').map((i, el) => this.jQuery(el).attr('title')));
                    const d = this.$select.select2('data');
                    arr.forEach((title) => {
                        const item = d.find(e => e.text === title);
                        const element = this.jQuery(item.element);
                        const parent = element.parent();
                        element.detach();
                        parent.append(element);
                    });
                    this.writeValue(this.$select.val());
                }
            });
        } catch (e) {
            console.warn(`can't make sortable because jQuery UI not loaded`);
        }
    }

    init() {
        this._defaultParams = Object.assign({}, {
            multiple: true,
            dropdownParent: this.jQuery(this.el.nativeElement).find('.adm-multi-select__dropdown-wrap'),
            placeholder: 'Select'
        }, this._params);
        this.params = this._defaultParams;
    }

    bindEvents() {
        this.$select
            .on('change', (event) => {
                clearTimeout(this.onChangeTimeout);
                this.onChangeTimeout = setTimeout(() => {
                    if (!!this._params.showSelectedCount) {
                        this.showSelectedCountFn(event);
                    }
                    this.change.emit([event, this.value]);
                }, 100);
            })
            .on('select2:open', (event) => {
                this.open.emit(event);
                this._isOpen = true;
                this._isAbove = this.jQuery(event.target).next().hasClass('select2-container--above');
            })
            .on('select2:opening', (event) => {
                this.opening.emit(event);
            })
            .on('select2:close', (event) => {
                this.close.emit(event);
                this._isOpen = false;
            })
            .on('select2:closing', (event) => {
                this.closing.emit(event);
            })
            .on('select2:select', (event) => {
                this.selectHandler(event);
                setTimeout(() => {
                    this.select.emit([event, this.value, event.params.data]);
                }, 200);
            })
            .on('select2:selecting', (event) => {
                this.selecting.emit(event);
            })
            .on('select2:unselect', (event) => {
                this.selectHandler(event);
                setTimeout(() => {
                    this.unselect.emit([event, this.value]);
                }, 200);
            })
            .on('select2:unselecting', (event) => {
                this.unselecting.emit(event);
            });
    }

    selectHandler(event) {
        clearTimeout(this.selectHandlerTimeout);
        this.selectHandlerTimeout = setTimeout(() => {
            const $element = $(event.params.data.element);
            switch (event.type) {
                case 'select2:select':
                    if (this.$select.find(':selected').length > 1) {
                        const $second = this.$select.find(':selected').eq(-2);
                        $element.detach();
                        $second.after($element);
                    } else {
                        $element.detach();
                        this.$select.prepend($element);
                    }
                    break;
                case 'select2:unselect':
                    this.$select.find(':selected').after($element);
                    break;
            }
            this.writeValue(this.$select.val());
        }, 10);
    }

    onAddNewBtnClick(e) {
        this.onAddClick.emit(e);
    }

    showSelectedCountFn(e: Event) {
        this.jQuery(e.currentTarget).parent().find('.select2-search.select2-search--inline .select2-selection__choice').remove();
        if (Array.isArray(this.value) && this.value.length > this._params.showSelectedCount) {
            this._isShowSelectedCount = true;
            this.jQuery(e.currentTarget)
                .parent()
                .find('.select2-search.select2-search--inline')
                .prepend(`<span class='select2-selection__choice'><span class='select2-selection__clear'>×</span> ${this.value.length} items selected </span>`);
        } else {
            this._isShowSelectedCount = false;
        }
    }

    writeValue(val: any): Promise<any> {
        return new Promise((resolve) => {
            clearTimeout(this.writeValueTimeout);
            this.writeValueTimeout = setTimeout(() => {
                //todo: check
                // if (JSON.stringify(this.value) !== JSON.stringify(val)) {
                this.value = val;
                this.$select.val(this.value).trigger('change');
                // }
                resolve();
            }, 2);
        });
    }

    ngAfterViewInit() {
        this.init();
        this.bindEvents();
    }

    ngOnDestroy() {
        if (this.$select) {
            try {
                this.$select.select2('destroy');
                this.$select.sortable('destroy');
            } catch (e) {

            }
        }
    }

    onChange: Function = (_: any) => {
    }
    onTouched: Function = () => {
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouched = fn;
    }
}