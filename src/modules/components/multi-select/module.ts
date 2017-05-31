///<reference path="select2/index.ts"/>
import { NgModule } from '@angular/core';

import { MultiSelectComponent } from './component';
import './select2/index'
import { Select2File } from './select2/index';
import { jQueryLoadService } from '../../shared/jquery.load';
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [CommonModule],
    exports: [MultiSelectComponent],
    declarations: [MultiSelectComponent],
    providers: [Select2File, jQueryLoadService]
})
export class MultiSelectModule {
    constructor() {
        Select2File.load();
    }
}
