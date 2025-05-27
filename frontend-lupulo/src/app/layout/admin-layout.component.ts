import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppTopbar } from './component/app.topbar';
import { AppMenu } from './component/app.menu';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, AppTopbar, AppMenu],
    template: `
        <div class="layout-wrapper">
            <!-- Topbar -->
            <app-topbar></app-topbar>

            <!-- Sidebar -->
            <div class="layout-sidebar">
                <app-menu></app-menu>
            </div>

            <!-- Contenido principal -->
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})
export class AdminLayoutComponent {}
