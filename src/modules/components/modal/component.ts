import { Component, OnInit, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'adm-modal-container',
    encapsulation: ViewEncapsulation.None,
    styleUrls:['./style.scss'],
    host: {
        '[class.inactive]': '!modal',
        '(click)':'onCancelClick($event)'
    },
    template: `
        <template [ngIf]="modal">
            <div class="adm-modal__wrap" (click)="preventPropagation($event);">
                <div class="adm-modal">
                    <div class="adm-modal__header">{{ modal.title }} <button (click)="onCancelClick($event);" class="adm-modal__close-btn"><i class="material-icons">close</i></button></div>
                    <div class="adm-modal__content" [innerHtml]="modal.content"></div>
                    <div class="adm-modal__footer">
                        <button class="adm-modal__btn" (click)="onCancelClick($event);">Cancel</button>
                        <button class="adm-modal__btn" (click)="onApplyClick($event);">OK</button>                    
                    </div>
                </div>
            </div>
        </template>
    `
})

export class ModalContainerComponent implements OnDestroy {
    modal:{title, content};
    constructor(private _zone: NgZone) { }

    showModal(obj:{title, content}){
        const baseOptions = {
            btns:{positive:'Ok', negative:'Cancel'}
        }
        if(obj.title && obj.content){
            this.modal = Object.assign({}, baseOptions, obj);
        }
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

    onApplyClick(e:Event){
        this._onApply.next(true);
        this._onApply.complete();
    }
    onCancelClick(e:Event){
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

    preventPropagation(e:Event){
        e.stopPropagation();
        e.preventDefault();
    }
}