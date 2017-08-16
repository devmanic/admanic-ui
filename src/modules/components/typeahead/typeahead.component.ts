import { Component, OnInit, Input, Directive, forwardRef, ElementRef, OnDestroy, ViewContainerRef, Renderer, Injector, ComponentFactoryResolver, NgZone, ComponentRef, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { _do } from "rxjs/operator/do";
import { letProto } from "rxjs/operator/let";
import { Subscription } from "rxjs/Subscription";
import { PopupService } from './popup.service';
import { TypeaheadResultsComponent } from './results.component';

enum Key {
    Tab = 9,
    Enter = 13,
    Escape = 27,
    ArrowUp = 38,
    ArrowDown = 40
}

const ADM_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TypeaheadComponent),
    multi: true
};

@Directive({
    selector: 'input[admTypeahead], textarea[admTypeahead]',
    providers: [ADM_TYPEAHEAD_VALUE_ACCESSOR],
    host: {
        '[class.is__open]': 'isPopupOpen',
        '(keydown)': 'handleKeyDown($event)',
        '(document:click)': 'dismissPopup()',
        '(click)':'$event.stopPropagation();',
        '[class.adm-typeahead]': 'true'
    }
})

export class TypeaheadComponent implements OnInit, OnDestroy {
    _valueChanges: Observable<string>;
    _userInput: string;
    _subscription: Subscription;
    _popupService: PopupService<TypeaheadResultsComponent>;
    _windowRef: ComponentRef<TypeaheadResultsComponent>;

    @Input() debounceTime: number = 100;
    @Input() admTypeahead: (text: Observable<string>) => Observable<any[]>;
    @Output() selectItem = new EventEmitter<any>();

    get isPopupOpen() {
        return this._windowRef != null;
    }

    private toString(value) {
        return (value !== undefined && value !== null) ? `${value}` : '';
    }
    private _onTouched = () => { };
    private _onChange = (_: any) => { };

    constructor(private _el: ElementRef,
        private _viewContainerRef: ViewContainerRef,
        private _renderer: Renderer,
        private _injector: Injector,
        componentFactoryResolver: ComponentFactoryResolver) {
        this._valueChanges = Observable.fromEvent(this._el.nativeElement, 'input', ($event: Event) => (<HTMLInputElement>$event.target).value);

        this._popupService = new PopupService<TypeaheadResultsComponent>(
            TypeaheadResultsComponent,
            _injector,
            _viewContainerRef,
            _renderer,
            componentFactoryResolver
        );
    }

    ngOnInit() {
        const inputValues$ = _do.call(this._valueChanges.debounceTime(this.debounceTime), value => {
            this.writeValue(value);
        });
        const results$ = letProto.call(inputValues$, this.admTypeahead);
        _do.call(this._valueChanges, (str: string) => {
            _do.call(results$)
        });
        this._subscription = this._subscribeToUserInput(results$);
    }

    _subscribeToUserInput(userInput: Observable<any[]>): Subscription {
        return userInput.subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            } else {
                this._openPopup();
                this._windowRef.instance.results = results;
                this._windowRef.instance.query = this._userInput;
                this._windowRef.changeDetectorRef.detectChanges();
            }
        })
    }

    _openPopup() {
        if (!this.isPopupOpen) {
            this._windowRef = this._popupService.open();
            this._windowRef.instance.selectEvent.subscribe((result: any) => this._selectResultClosePopup(result));
        }
    }

    _closePopup() {
        this._popupService.close();
        this._windowRef = null;
    }

    _selectResultClosePopup(result: string) {
        this._el.nativeElement.value = result;
        this.writeValue(result);
        this._closePopup();
        this.selectItem.emit(Object.assign(new Event('typeAheadSelect'), {item:result}));
    }

    dismissPopup() {
        if (this.isPopupOpen) {
        this._closePopup();
            this.writeValue(this._userInput);
        }
    }

    writeValue(value) {
        this._userInput = value;
        if(!this._el.nativeElement.value && value){
            this._el.nativeElement.value = value;
        }
        this._onChange(value);
    }

    handleKeyDown(event: KeyboardEvent) {
        if (!this.isPopupOpen) {
            return;
        }

        if (Key[this.toString(event.which)]) {
            switch (event.which) {
                case Key.ArrowDown:
                    event.preventDefault();
                    this._windowRef.instance.next();
                    break;
                case Key.ArrowUp:
                    event.preventDefault();
                    this._windowRef.instance.prev();
                    break;
                case Key.Enter:
                case Key.Tab:
                    const result = this._windowRef.instance.getActive();
                    if (!!result) {
                        event.preventDefault();
                        event.stopPropagation();
                        this._selectResultClosePopup(result);
                    }
                    this._closePopup();
                    break;
                case Key.Escape:
                    event.preventDefault();
                    this.dismissPopup();
                    break;
            }
        }
    }

    registerOnChange(fn: (value: any) => any): void { this._onChange = fn; }
    registerOnTouched(fn: () => any): void { this._onTouched = fn; }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }
}