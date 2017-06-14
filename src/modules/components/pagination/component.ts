import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const BASE_SHIFT = 0;
const TITLE_SHIFT = 1;

@Component({
    selector: 'adm-pagination',
    template: `
        pagination component
    `
})
export class PaginationComponent implements OnInit {
    @Input() current: number;
    @Input() total: number;
    @Input() visiblePages: number;
    @Input() titles: { first, prev, prevSet, nextSet, next, last } = {
        first: 'First',
        prev: '\u00AB',
        prevSet: '...',
        nextSet: '...',
        next: '\u00BB',
        last: 'Last'
    };

    @Output() onPageChanged: EventEmitter<number> = new EventEmitter<number>();


    constructor() {
    }


    get calcBlocks(): { total, current, size } {
        const total = Number(this.total);
        const blockSize = Number(this.visiblePages);
        const current = Number(this.current) + TITLE_SHIFT;
        const blocks = Math.ceil(total / blockSize);
        const currBlock = Math.ceil(current / blockSize) - TITLE_SHIFT;

        return {
            total: blocks,
            current: currBlock,
            size: blockSize
        };
    }

    get isPrevDisabled(): boolean {
        return this.current <= BASE_SHIFT;
    }

    get isNextDisabled(): boolean {
        return this.current >= (this.total - TITLE_SHIFT);
    }

    get isPrevMoreHidden(): boolean {
        const blocks = this.calcBlocks;
        return (blocks.total === TITLE_SHIFT) || (blocks.current === BASE_SHIFT);
    }

    get isNextMoreHidden(): boolean {
        const blocks = this.calcBlocks;
        return (blocks.total === TITLE_SHIFT) || (blocks.current === (blocks.total - TITLE_SHIFT));
    }

    get visibleRange() {
        const blocks = this.calcBlocks;

        console.log(blocks);

        const start = blocks.current * blocks.size;
        const delta = this.total - start;
        const end = start + ((delta > blocks.size) ? blocks.size : delta);

        return [start + TITLE_SHIFT, end + TITLE_SHIFT];
    }

    ngOnInit() {
        console.log(this.visibleRange);
    }
}