import {Routes} from '@angular/router';
import {PlaygroundComponent} from './playground.component';
import {ZELECT_ROUTES} from './zelect/zelect.routes';

export const PG_ROUTES: Routes = [
  {
    path: '', component: PlaygroundComponent,
    children: [
      ...ZELECT_ROUTES
    ]
  }
];
