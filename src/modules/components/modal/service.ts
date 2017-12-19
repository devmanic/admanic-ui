import {
    Injectable, ComponentRef, ApplicationRef, NgZone,
    ReflectiveInjector, ViewContainerRef, ComponentFactoryResolver, Injector
} from '@angular/core';
import { ModalContainerComponent } from './modal.component';
import { modalI } from './model';

@Injectable()
export class ModalManagerService {
    container: ComponentRef<any>;
    rootViewContainerRef: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private ngZone: NgZone,
                private appRef: ApplicationRef,
                private injector: Injector) {
    }

    setRootViewContainerRef(vRef: ViewContainerRef) {
        this.rootViewContainerRef = vRef;
    }

    show(obj: modalI, onOk?: Function, onClose?: Function) {
        this.dispose();
        setTimeout(() => {
            // get app root view component ref
            if (!this.rootViewContainerRef) {
                try {
                    // this._rootViewContainerRef = this.appRef['_rootComponents'][0].location.vcRef;
                    this.rootViewContainerRef = this.appRef['_rootComponents'][0]['_hostElement'].vcRef;
                } catch (e) {
                    throw new Error('Please set root ViewContainerRef using setRootViewContainerRef(vRef: ViewContainerRef) method.');
                }
            }

            let providers = ReflectiveInjector.resolve([]);

            let toastFactory = this.componentFactoryResolver.resolveComponentFactory(ModalContainerComponent);
            let childInjector = ReflectiveInjector.fromResolvedProviders(providers, this.rootViewContainerRef.parentInjector);
            this.container = this.rootViewContainerRef.createComponent(toastFactory, this.rootViewContainerRef.length, childInjector);
            document.querySelector('body').style.overflow = 'hidden';

            this.container.instance.onExit().subscribe((res) => {
                this.dispose();
                if (onClose)
                    onClose();
            });

            this.container.instance.onApply().subscribe((res) => {
                this.container.instance.ngOnDestroy = () => {
                };
                this.dispose();
                if (onOk)
                    onOk();
            });

            this.container.instance.showModal(obj);
        }, 0);

    }

    dispose() {
        if (this.container) {
            this.container.instance.onSubscribeFromNavigationStart();
            this.container.destroy();
            this.container = null;
            document.querySelector('body').style.overflow = '';
        }
    }
}