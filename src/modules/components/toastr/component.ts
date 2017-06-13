import {
    Component, ChangeDetectorRef,
    NgZone, OnDestroy, AnimationTransitionEvent, ViewEncapsulation
} from '@angular/core';
import { Toast } from './model';
import { ToastOptions } from './options';
import { DomSanitizer } from '@angular/platform-browser';
import 'rxjs/add/operator/first';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'adm-toast-container',
    styleUrls: [`./styles.scss`],
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': 'positionClass'
    },
    template: `
        <div *ngFor="let toast of toasts; trackBy:trackByFn" class="adm-toast is__{{toast.type}}"
             (click)="clicked(toast)">
            <div class="adm-toast__close-btn" *ngIf="toast.config.showCloseButton" (click)="removeToast(toast)">
                &times;
            </div>
            <div *ngIf="toast.title" class="{{toast.config.titleClass || titleClass}}">{{toast.title}}</div>
            <div *ngIf="toast.config.enableHTML">
                <span [innerHTML]="toast.message"></span>
            </div>
            <span *ngIf="!toast.config.enableHTML" class="{{toast.config.messageClass || messageClass}}">{{toast.message}}</span>
        </div>
    `
})
export class ToastContainer implements OnDestroy {
    messageClass: string;
    titleClass: string;
    positionClass: string;
    maxShown: number;
    newestOnTop: boolean;
    animate: string;
    toasts: Toast[] = [];

    _fresh: boolean = true;
    onToastClicked: (toast: Toast) => void;

    _onEnter: Subject<any> = new Subject();
    _onExit: Subject<any> = new Subject();

    constructor(private sanitizer: DomSanitizer,
                private cdr: ChangeDetectorRef,
                private _zone: NgZone,
                options: ToastOptions) {
        Object.assign(this, options);
    }

    onEnter(): Observable<void> {
        return this._onEnter.asObservable();
    }

    onExit(): Observable<void> {
        return this._onExit.asObservable();
    }

    addToast(toast: Toast) {
        if (this.positionClass.indexOf('top') > 0) {
            if (this.newestOnTop) {
                this.toasts.unshift(toast);
            } else {
                this.toasts.push(toast);
            }

            if (this.toasts.length > this.maxShown) {
                const diff = this.toasts.length - this.maxShown;

                if (this.newestOnTop) {
                    this.toasts.splice(this.maxShown);
                } else {
                    this.toasts.splice(0, diff);
                }
            }
        } else {
            this.toasts.unshift(toast);
            if (this.toasts.length > this.maxShown) {
                this.toasts.splice(this.maxShown);
            }
        }

        if (this.animate === null && this._fresh) {
            this._fresh = false;
            this._onEnter.next();
            this._onEnter.complete();
        }

        this.cdr.detectChanges();
    }

    removeToast(toast: Toast) {
        if (toast.timeoutId) {
            clearTimeout(toast.timeoutId);
            toast.timeoutId = null;
        }

        this.toasts = this.toasts.filter((t) => {
            return t.id !== toast.id;
        });
    }

    removeAllToasts() {
        this.toasts = [];
    }

    clicked(toast: Toast) {
        if (this.onToastClicked) {
            this.onToastClicked(toast);
        }
    }

    anyToast(): boolean {
        return this.toasts.length > 0;
    }

    findToast(toastId: number): Toast | void {
        for (let toast of this.toasts) {
            if (toast.id === toastId) {
                return toast;
            }
        }
        return null;
    }

    onAnimationEnd(event: AnimationTransitionEvent) {
        if (event.toState === 'void' && !this.anyToast()) {
            this._ngExit();
        } else if (this._fresh && event.fromState === 'void') {
            // notify when first animation is done
            this._fresh = false;
            this._zone.run(() => {
                this._onEnter.next();
                this._onEnter.complete();
            });
        }

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

    trackByFn(index, item) {
        return item.id;
    }
}
