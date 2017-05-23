import { Component } from '@angular/core';
import { PG_ROUTES } from './playground.routes';

@Component({
    selector: 'playground',
    styleUrls: [
        './playground.component.scss'
    ],
    templateUrl: './playground.template.html'
})
export class PlaygroundComponent {
    public memuItems: Array<{ path: string, title: string }> = PG_ROUTES[0].children.map((item: any) => ({
        path: item.path,
        title: item.path
    }));
}
