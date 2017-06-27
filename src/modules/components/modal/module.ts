/**
 * Created by bnosachenko on 27.06.17.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputModule } from '../text-input/module';
import { ModalComponent } from './component';


@NgModule({
    imports: [CommonModule, InputModule],
    exports: [ModalComponent],
    declarations: [ModalComponent],
    providers: []
})
export class ModalModule {
}
