import { Routes } from '@angular/router';
import { LoginComponent } from './app/pages/auth/login.component';

import { adminGuard } from './app/guards/admin.guard';
import { userGuard } from './app/guards/user.guard';
import { GestionUsuariosComponent } from './app/pages/usuarios/gestion-usuarios.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    {
        path: 'admin',
        loadComponent: () => import('./app/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
        canActivate: [adminGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./app/pages/dashboard/dashboard').then((m) => m.Dashboard)
            },
            {
                path: 'inventario',
                loadComponent: () => import('./app/pages/inventario/catalogo-inventario.component').then((m) => m.CatalogoInventarioComponent)
            },
            {
                path: 'entrada-stock',
                loadComponent: () => import('./app/pages/entrada-stock/entrada-stock.component').then((m) => m.EntradaStockComponent)
            },
            {
                path: 'ventas-multiples',
                loadComponent: () => import('./app/pages/ventas/ventas-multiples.component').then((m) => m.VentasMultiplesComponent)
            },
            {
                path: 'usuarios',
                component: GestionUsuariosComponent
            },
            {
                path: 'estadisticas',
                loadComponent: () => import('./app/pages/estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent)
            }
        ]
    },

    {
        path: 'usuario-panel',
        loadComponent: () => import('./app/pages/usuario-panel.component').then((m) => m.UsuarioPanelComponent),
        canActivate: [userGuard]
    },

    { path: '**', redirectTo: 'login' }
];
