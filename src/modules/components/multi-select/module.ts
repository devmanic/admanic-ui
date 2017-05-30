import { NgModule } from '@angular/core';

import { MultiSelectComponent } from './component';
import './select2/index'
import { Select2File } from './select2/index';
import { jQueryLoadService } from '../../shared/jquery.load';


@NgModule({
    imports: [],
    exports: [MultiSelectComponent],
    declarations: [MultiSelectComponent],
    providers: [Select2File, jQueryLoadService]
})
export class MultiSelectModule {
}
