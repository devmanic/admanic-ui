/**
 * Created by bnosachenko on 03.07.17.
 */
import * as _ from 'lodash';
import { Injectable, ComponentRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';

@Injectable()
export class ModalService {
    container: ComponentRef<any>;
    private _rootViewContainerRef: ViewContainerRef;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {

    }

    setRootViewContainerRef(vRef: ViewContainerRef) {
        this._rootViewContainerRef = vRef;
    }


}
