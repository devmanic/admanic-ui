import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {
    private el: HTMLInputElement;
    private elID: string = 'COPY_TO_CLIPBOARD_EL';

    constructor() {
        this.getElement();
    }

    public copy(data: string) {
        this.el.value = data;
        this.el.select();
        // ToastrService.clear();
        try {
            document.execCommand('copy');
            this.el.blur();
            // ToastrService.success('', 'Copied to the clipboard');
        } catch (err) {
            // ToastrService.error('', 'Your browser does not support the clipboard');
        }
    }

    public getElement() {
        let el = <HTMLInputElement> document.querySelector(`#${this.elID}`);
        !el ? this.createElement() : this.el = el;
    }

    public createElement() {
        let el: HTMLInputElement = <HTMLInputElement> document.createElement('INPUT');
        el.id = this.elID;
        el.type = 'text';
        document.body.appendChild(el);
        this.el = el;
    }
}
