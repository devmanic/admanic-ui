/**
 * Created by bnosachenko on 27.06.17.
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';


@Component({
    selector: 'adm-modal',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adm-modal',
    },
    styleUrls: ['./style.scss'],
    templateUrl: './template.html'
})

export class ModalComponent {
    @Input() public message: string;

    constructor() {

    }

    public showMessage(): void {
        alert(this.message);
    }
}
