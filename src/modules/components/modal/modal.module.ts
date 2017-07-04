import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ModalComponent],
    exports: [ModalComponent]
    // entryComponents: [NgbModalBackdrop, NgbModalWindow],
    // providers: [NgbModal]
})

export class ModalModule {
    constructor(){
        alert('v konstructore');
    }
    public showMessage(): void {
        alert('nahui!');
    }
}
