import { Component, Directive, ElementRef, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector: 'textarea[dynamic-height]'
})
export class DynamicTextAreaDirective implements OnDestroy {
    _keyUpSubscriber: Subscription;

    constructor(el: ElementRef) {
        let source = Observable.fromEvent(el.nativeElement, 'keyup');
        el.nativeElement.style.resize = 'none';
        el.nativeElement.style.overflow = 'hidden';
        source.subscribe((e: Event) => {
            (<HTMLElement>e.target).style.height = 'auto';
            (<HTMLElement>e.target).style.height = `${(<HTMLElement>e.target).scrollHeight + 2}px`;
        });
    }

    ngOnDestroy() {
        if (this._keyUpSubscriber) {
            this._keyUpSubscriber.unsubscribe();
        }
    }
}

@Component({
    selector: 'adm-input-container',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./styles.scss'],
    host: {
        '[class.adm-input__container]': 'true',
        '[class.is-invalid]': 'invalid',
        '[class.with-addon]': '!!addonIcon',
        '[class.is-disabled]': 'disabled'
    },
    template: `
        <label class="adm-input__label" [ngClass]="{'is-required':required}" *ngIf="!!label">{{label}}</label>
        <div class="wrap">
            <div *ngIf="!!addonIcon" class="adm-input__addon">
                <i class="material-icons">{{addonIcon}}</i>
            </div>
            <ng-content></ng-content>
        </div>
        <div *ngIf="control && invalid">
            <adm-validator-messages [field]="control"></adm-validator-messages>
        </div>
        <div class="adm-input__description" *ngIf="description">{{ description }}</div>
    `
})
export class InputContainer {
    _ctrl: FormControl;
    _required: boolean;

    @Input() set control(ctrl: FormControl) {
        this._required = ctrl.hasError('required');
        this._ctrl = ctrl;
    };

    get control(): FormControl {
        return this._ctrl;
    }

    @Input() addonIcon: string;
    @Input() label: string;
    @Input() description: string;
    @Input() disabled: boolean;

    get required(): boolean {
        this._ctrl.hasError('required') ? this._required = true : '';
        return this._required || this._ctrl.hasError('required');
    };

    get invalid(): boolean {
        if (this.control) {
            if (this.control.touched) {
                return this.control.invalid;
            }
        }
        return false;
    }
}
