import { Component, OnInit, NgZone, OnDestroy, ViewEncapsulation, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'adm-modal-container',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./style.scss'],
    host: {
        '[class.inactive]': '!modal',
        '(click)': 'onCancelClick($event)'
    },
    template: `
        <template [ngIf]="modal">
            <div class="adm-modal__wrap" (click)="preventPropagation($event);">
                <div class="adm-modal">
                    <template [ngIf]="modal.title && modal.title.length">
                        <div class="adm-modal__header">{{ modal.title }} <button (click)="onCancelClick($event);" class="adm-modal__close-btn"><i class="material-icons">close</i></button></div>                        
                    </template>
                    <div class="adm-modal__content">
                        <template [ngIf]="!!modal.type && iconTypeExist">
                            <div class="adm-modal-icon is__success" *ngIf="modal.type === 'success'">
                               <div class="swal2-success-circular-line-left"></div><span class="swal2-success-line-tip swal2-animate-success-line-tip"></span> <span class="swal2-success-line-long swal2-animate-success-line-long"></span><div class="swal2-success-ring"></div> <div class="swal2-success-fix" style="background: rgb(255, 255, 255);"></div><div class="swal2-success-circular-line-right" style="background: rgb(255, 255, 255);"></div>
                            </div>
                            <div class="adm-modal-icon is__success" *ngIf="modal.type === 'error'">

                            </div>
                            
                        </template>
                        <template [ngIf]="modal.content && modal.content.length">
                            <div [innerHtml]="modal.content"></div>
                        </template>
                        <template [ngIf]="renderTemplate">
                            <adm-dynamic-render-component [template]="modal.content"></adm-dynamic-render-component>
                        </template>
                    </div>                    
                    <template [ngIf]="!hideActionBar">
                        <div class="adm-modal__footer">
                            <button class="adm-modal__btn" *ngIf="modal.btns.negative" (click)="onCancelClick($event);">{{ modal.btns.negative }}</button>
                            <button class="adm-modal__btn" *ngIf="modal.btns.positive" (click)="onApplyClick($event);">{{ modal.btns.positive }}</button>                    
                        </div>
                    </template>
                </div>
            </div>
        </template>
    `
})

export class ModalContainerComponent implements OnDestroy {
    modal: { title?: string, content?: any, btns?: { postive: string, negative: string } | false, type?: 'success' | 'error' | 'info' | 'warning' };
    iconTypes: string[] = ['success', 'error', 'info', 'warning'];
    iconTypeExist: boolean;
    renderTemplate: boolean;
    constructor(private _zone: NgZone) { }

    showModal(obj: { title?: string, content?: any, btns?: { postive: string, negative: string } | false, type?: 'success' | 'error' | 'info' | 'warning' }) {
        const baseOptions = {
            btns: { positive: 'Ok', negative: 'Cancel' }
        }
        if (obj.title || obj.content) {
            if (obj.content instanceof HTMLElement) {
                obj.content = obj.content.innerHTML;
            } else if (obj.content instanceof TemplateRef) {
                this.renderTemplate = true;
            }
            if (obj.type) {
                this.iconTypeExist = this.iconTypes.indexOf(obj.type) !== -1;
            }
            this.modal = Object.assign({}, baseOptions, obj);
        }
    }

    get hideActionBar(): boolean {
        return typeof this.modal.btns === 'boolean';
    }

    _onEnter: Subject<any> = new Subject();
    _onExit: Subject<any> = new Subject();
    _onApply: Subject<any> = new Subject();

    onEnter(): Observable<void> {
        return this._onEnter.asObservable();
    }

    onExit(): Observable<void> {
        return this._onExit.asObservable();
    }

    onApply(): Observable<void> {
        return this._onApply.asObservable();
    }

    onApplyClick(e: Event) {
        this._onApply.next(true);
        this._onApply.complete();
    }
    onCancelClick(e: Event) {
        this._onExit.next(false);
        this._onExit.complete();
    }

    _ngExit() {
        this._zone.onMicrotaskEmpty.first().subscribe(() => {
            this._onExit.next(false);
            this._onExit.complete();
        });
    }

    ngOnDestroy() {
        this._ngExit();
    }

    preventPropagation(e: Event) {
        e.stopPropagation();
        e.preventDefault();
    }
}

@Component({
    selector: 'adm-dynamic-render-component',
    template: ``
})

export class DynamicRenderComponent implements OnInit {
    @Input() template;
    constructor(private viewContainerRef: ViewContainerRef) {
    }

    ngOnInit() {
        this.viewContainerRef.createEmbeddedView(this.template, {});
    }
}