import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Pipe, PipeTransform, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'adm-typeahead-results',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../single-select/style.scss', './styles.scss'],
    template: `
        <div class="adm-select__options">
            <ul class="adm-select__options__list">
                <li *ngFor="let item of results; trackBy: trackListByFn;" (click)="onItemClick(item);" [innerHtml]="item | higlight:query"></li>
            </ul>
        </div>
    `
})

export class TypeaheadResultsComponent implements OnInit {
    @Input() results:string[] = [];
    @Input() query:string;
    @Output('select') selectEvent = new EventEmitter();
    constructor() { }

    ngOnInit() { }

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
        return value.replace(new RegExp(query, 'gi'), str=> `<b>${str}</b>`);
    }
}