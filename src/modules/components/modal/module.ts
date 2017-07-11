import { NgModule } from '@angular/core';
import { ModalContainerComponent } from "./component";
import { ModalManagerService } from "./service";


@NgModule({
    imports: [],
    exports: [ModalContainerComponent],
    declarations: [ModalContainerComponent],
    providers: [ModalManagerService],
    entryComponents: [ModalContainerComponent]
})
export class ModalModule {

}
