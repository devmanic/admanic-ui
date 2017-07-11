import {
    Injectable, ComponentRef, ApplicationRef, NgZone,
    ReflectiveInjector, ViewContainerRef, ComponentFactoryResolver, Injector
} from '@angular/core';
import { ModalContainerComponent } from './component';

@Injectable()
export class ModalManagerService {
    container:ComponentRef<any>;
    rootViewContainerRef:ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private ngZone: NgZone,
                private appRef: ApplicationRef,
                private injector: Injector) { }

    setRootViewContainerRef(vRef: ViewContainerRef) {
        this.rootViewContainerRef = vRef;
    }

     show(content:string, options?: Object): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.container) {
                // get app root view component ref
                if (!this.rootViewContainerRef) {
                    try {
                        // this._rootViewContainerRef = this.appRef['_rootComponents'][0].location.vcRef;
                        this.rootViewContainerRef = this.appRef['_rootComponents'][0]['_hostElement'].vcRef;
                    } catch (e) {
                        reject(new Error('Please set root ViewContainerRef using setRootViewContainerRef(vRef: ViewContainerRef) method.'));
                    }
                }

                let providers = ReflectiveInjector.resolve([]);

                // create and load ToastContainer
                let toastFactory = this.componentFactoryResolver.resolveComponentFactory(ModalContainerComponent);
                let childInjector = ReflectiveInjector.fromResolvedProviders(providers, this.rootViewContainerRef.parentInjector);
                this.container = this.rootViewContainerRef.createComponent(toastFactory, this.rootViewContainerRef.length, childInjector);
                

                this.container.instance.onExit().subscribe(() => {
                    this.dispose();
                });
            }

            resolve(true);
        });
    }

     dispose() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}