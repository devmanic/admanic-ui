import {Component, Input} from '@angular/core';

export type ButtonType = 'primary' | 'success' | 'danger' | 'warning' | 'neutral';
export type ButtonSize = 'small' | 'large' | 'default';

@Component({
    selector: 'a[adm-button], button[adm-button], div[adm-button]',
    styleUrls: ['button.style.scss'],
    host: {
        '[class.is-primary]': `buttonType === 'primary'`,
        '[class.is-neutral]': `buttonType === 'neutral'`,
        '[class.is-success]': `buttonType === 'success'`,
        '[class.is-danger]': `buttonType === 'danger'`,
        '[class.is-warning]': `buttonType === 'warning'`,
        '[class.is-small]': `size === 'small'`,
        '[class.is-large]': `size === 'large'`,
        '[class.is-disabled]': `!!disabled === true`,
    },
    template: `
        <span class="adm-button-spinner" *ngIf="loading && !disabled"></span>
        <i *ngIf="icon && iconPosition === 'left' && !loading" class="material-icons">{{icon}}</i>
        <ng-content></ng-content>
        <i *ngIf="icon && iconPosition === 'right'  && !loading" class="material-icons">{{icon}}</i>
    `
})

export class ButtonComponent {
    @Input() icon: string;
    @Input() iconPosition: 'left' | 'right' = 'left';
    @Input() buttonType: ButtonType = 'neutral';
    @Input() size: ButtonSize = 'default';
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;

    constructor() {
    }
}

