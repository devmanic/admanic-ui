import { NgModule } from '@angular/core';
import { TypeaheadComponent } from './component';
import { SingleSelectModule } from "../single-select/module";
import { InputModule } from "../text-input/module";

@NgModule({
    imports: [SingleSelectModule, InputModule],
    exports: [TypeaheadComponent],
    declarations: [TypeaheadComponent],
    providers: [],
})
export class TypeaheadModule { }
