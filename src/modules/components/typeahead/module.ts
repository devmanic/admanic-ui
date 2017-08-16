import { NgModule } from '@angular/core';
import { TypeaheadComponent } from './typeahead.component';
import { SingleSelectModule } from "../single-select/module";
import { InputModule } from "../text-input/module";
import { TypeaheadResultsComponent, HighlightPipe } from './results.component';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [SingleSelectModule, InputModule, CommonModule],
    exports: [TypeaheadComponent, TypeaheadResultsComponent],
    declarations: [TypeaheadComponent, TypeaheadResultsComponent, HighlightPipe],
    entryComponents:[TypeaheadResultsComponent],
    providers: [],
})
export class TypeaheadModule { }
