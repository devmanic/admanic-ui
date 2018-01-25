import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [`
    .pg-navigation {
      padding: 0;
    }

    .pg-navigation > * {
      display: inline-block;
      margin: 0 10px;
    }
  `],
  template: `
    <h1>Admanic UI playground</h1>
    <hr>
    <ul class="pg-navigation">
      <li *ngFor="let item of menu">
        <a [routerLink]="item.path">{{item.title}}</a>
      </li>
    </ul>
    <hr>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  menu: { title, path }[] = [
    {title: 'Buttons', path: ['buttons']},
    {title: 'Single Select', path: ['single-select']},
  ]
}
