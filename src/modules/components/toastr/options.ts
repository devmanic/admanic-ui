import { Injectable } from '@angular/core';

export const TOAST_POSITIONS: string[] = [
    'is__top-right',
    'is__top-left',
    'is__top-center',
    'is__bottom-center',
    'is__top-full-width',
    'is__bottom-full-width',
    'is__bottom-right',
    'is__bottom-left'
];

@Injectable()
export class ToastOptions {
    positionClass: string = TOAST_POSITIONS[0];
    maxShown: number = 5;
    newestOnTop: boolean = true;
    animate: string = 'fade';
    toastLife: number = 3000;
    enableHTML: boolean = false;
    dismiss: string = 'auto';
    messageClass: string = 'adm-toast__message';
    titleClass: string = 'adm-toast__title';
    showCloseButton: boolean = false;

    constructor() {
    }

}
