// src/app/layout/component/app.topbar.ts
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../services/auth.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        AppConfigurator,
        OverlayPanelModule, // para <p-overlayPanel>
        ButtonModule
    ],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i class="pi pi-bars"></i>
                </button>
                <a class="layout-topbar-logo" routerLink="/">
                    <img src="/assets/logo.png" alt="Un Mar de Lúpulo" class="h-16 w-auto sm:h-12" />
                    <span>Un Mar de Lúpulo</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <div class="layout-config-menu">
                    <app-configurator />
                </div>

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        <button type="button" class="layout-topbar-action" (click)="op.toggle($event)">
                            <i class="pi pi-user"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- overlayPanel para perfil -->
        <p-overlayPanel #op [dismissable]="true" [showCloseIcon]="false" [style]="{ width: '200px' }">
            <div class="flex flex-col items-center p-3">
                <i class="pi pi-user" style="font-size:2rem"></i>
                <div class="mt-2">{{ userEmail }}</div>
                <button pButton label="Cerrar sesión" icon="pi pi-sign-out" class="p-button-sm p-button-danger mt-3" (click)="onLogout(); op.hide()"></button>
            </div>
        </p-overlayPanel>
    `
})
export class AppTopbar {
    userEmail = '';

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) {
        const token = this.authService.obtenerToken();
        if (token) {
            try {
                const payload: any = JSON.parse(atob(token.split('.')[1]));
                this.userEmail = payload.email || payload.sub || 'Usuario';
            } catch {
                this.userEmail = 'Usuario';
            }
        }
    }

    onLogout(): void {
        this.authService.eliminarToken();
        this.router.navigate(['/login']);
    }
}
