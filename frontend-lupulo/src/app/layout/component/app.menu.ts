import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    providers: [AuthService],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private authService: AuthService) {}

    ngOnInit() {
        const rol = this.authService.obtenerRol();

        const items: MenuItem[] = [
            {
                label: 'Administración',
                icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Inventario',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/admin/inventario']
                    },
                    {
                        label: 'Entrada de stock',
                        icon: 'pi pi-fw pi-plus-circle',
                        routerLink: ['/admin/entrada-stock']
                    },
                    {
                        label: 'Ventas',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/admin/ventas-multiples']
                    }
                ]
            }
        ];

        if (rol === 'ADMIN') {
            items[0].items?.push(
                {
                    label: 'Gestión de Usuarios',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/admin/usuarios']
                },
                {
                    label: 'Estadísticas',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/admin/estadisticas']
                }
            );
        }

        this.model = items;
    }
}
