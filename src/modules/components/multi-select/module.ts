import {NgModule} from '@angular/core';

import {MultiSelectComponent} from './multi-select.component';
import {CommonModule} from '@angular/common';
import {Observable} from 'rxjs/Observable';

declare const $: any;

@NgModule({
    imports: [CommonModule],
    exports: [MultiSelectComponent],
    declarations: [MultiSelectComponent],
    providers: []
})
export class MultiSelectModule {

    constructor() {
        Observable.fromEvent(window, 'resize').debounceTime(300).subscribe(() => {
            [].forEach.call(document.querySelectorAll('.select2-search__field'), (el) => {
                if (el.style.width != '0.75em' && el.style.width != 'auto') {
                    el.style.width = 'auto';
                }
            });
        });
    }
}
