///<reference path="select2/index.ts"/>
import { NgModule } from '@angular/core';

import { MultiSelectComponent } from './multi-select.component';
import './select2/index';
import { Select2File } from './select2/index';
import { jQueryLoadService } from '../../shared/jquery.load';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
declare const $: any;

@NgModule({
    imports: [CommonModule],
    exports: [MultiSelectComponent],
    declarations: [MultiSelectComponent],
    providers: [Select2File, jQueryLoadService]
})
export class MultiSelectModule {
    constructor() {
        Select2File.load();
        Observable.fromEvent(window, 'resize').debounceTime(300).subscribe(() => {
            [].forEach.call(document.querySelectorAll('.select2-search__field'), (el) => {
                if (el.style.width != '0.75em' && el.style.width != 'auto') {
                    el.style.width = 'auto';
                }
            });
        });
    }
}
