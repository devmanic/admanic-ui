import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Pipe, PipeTransform, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'adm-typeahead-results',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../single-select/style.scss', './styles.scss'],
    host:{
        '(click)':'$event.stopPropagation()'
    },
    template: `
        <div class="adm-select__options">
            <ul class="adm-select__options__list">
                <li 
                    *ngFor="let item of results; let idx = index; trackBy: trackListByFn;" 
                    [class.is__active]="idx === activeIdx"
                    (click)="onItemClick(item);" 
                    [innerHtml]="item | higlight:query"></li>
            </ul>
        </div>
    `
})

export class TypeaheadResultsComponent {
    @Input() results:string[] = [];
    @Input() query:string;
    @Output('select') selectEvent = new EventEmitter();
    @Output('activeChange') activeChangeEvent = new EventEmitter();

    focusFirst = true;
    activeIdx = 0;

    getActive() { return this.results[this.activeIdx]; }
    markActive(activeIdx: number) {
        this.activeIdx = activeIdx;
    }

    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        } else {
            this.activeIdx++;
        }
    }

    prev() {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        } else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        } else {
            this.activeIdx--;
        }
    }

    trackListByFn(index: number, item:string) {
        return item;
    }

    onItemClick(item){
        this.selectEvent.emit(item);
    }

}


@Pipe({
    name: 'higlight'
})

export class HighlightPipe implements PipeTransform {
    transform(value:string, query:string): any {
        return value.replace(new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'), 'gi'), str=> `<b>${str}</b>`);
    }
}