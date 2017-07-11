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

     show(obj:{title, content}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.dispose();
            setTimeout(()=>{
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

                this.container.instance.onExit().subscribe((res) => {
                    this.dispose();
                    reject(res);
                });

                this.container.instance.onApply().subscribe((res)=>{
                    this.dispose();
                    resolve(res);
                });

                this.container.instance.showModal(obj)
            }, 300);            
            
        });
    }

     dispose() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}