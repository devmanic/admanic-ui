import { NgModule } from '@angular/core';
import { ModalContainerComponent } from "./component";
import { ModalManagerService } from "./service";
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [CommonModule],
    exports: [ModalContainerComponent],
    declarations: [ModalContainerComponent],
    providers: [ModalManagerService],
    entryComponents: [ModalContainerComponent]
})
export class ModalModule {

}
