import { NgModule } from '@angular/core';
import { ModalContainerComponent, DynamicRenderComponent } from "./modal.component";
import { ModalManagerService } from "./service";
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [CommonModule],
    exports: [ModalContainerComponent, DynamicRenderComponent],
    declarations: [ModalContainerComponent, DynamicRenderComponent],
    providers: [ModalManagerService],
    entryComponents: [ModalContainerComponent, DynamicRenderComponent]
})
export class ModalModule {

}
