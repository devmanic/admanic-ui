import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { PG_ROUTES } from './playground/playground.routes';
import { ZELECT_ROUTES } from './playground/zelect/zelect.routes';

export const ROUTES: Routes = [
    ...PG_ROUTES,
    ...ZELECT_ROUTES
];
