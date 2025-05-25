import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AppLayout } from './app/layout/component/app.layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AppLayout],
  template: `
    <ng-container *ngIf="currentUrl === '/login'; else withLayout">
      <router-outlet></router-outlet>
    </ng-container>
    <ng-template #withLayout>
      <app-layout>
        <router-outlet></router-outlet>
      </app-layout>
    </ng-template>
  `
})
export class AppComponent {
  currentUrl = '';

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.currentUrl = e.urlAfterRedirects);
  }
}