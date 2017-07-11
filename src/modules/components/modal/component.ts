import { Component, OnInit, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

@Component({
    selector: 'adm-modal-container',
    encapsulation: ViewEncapsulation.None,
    styleUrls:['./style.scss'],
    template: `
        <div class="adm-modal__wrap">
            <div class="adm-modal">
                <div class="adm-modal__header">Modal Header <button class="adm-modal__close-btn"><i class="material-icons">close</i></button></div>
                <div class="adm-modal__content">
                    Lorem lorem lorem lorem lorem lorem lorem lorem
                </div>
                <div class="adm-modal__footer">
                    <button class="adm-modal__btn">Cancel</button>
                    <button class="adm-modal__btn">OK</button>                    
                </div>
            </div>
        </div>
    `
})

export class ModalContainerComponent implements OnDestroy {
    constructor(private _zone: NgZone) { }

    _onEnter: Subject<any> = new Subject();
    _onExit: Subject<any> = new Subject();
    
    onEnter(): Observable<void> {
        return this._onEnter.asObservable();
    }

    onExit(): Observable<void> {
        return this._onExit.asObservable();
    }

     _ngExit() {
        this._zone.onMicrotaskEmpty.first().subscribe(() => {
            this._onExit.next();
            this._onExit.complete();
        });
    }

    ngOnDestroy() {
        this._ngExit();
    }
}