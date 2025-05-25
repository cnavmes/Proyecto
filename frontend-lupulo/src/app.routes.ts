import { Routes } from '@angular/router';
import { LoginComponent } from './app/pages/auth/login.component';
import { adminGuard } from './app/guards/admin.guard';
import { userGuard } from './app/guards/user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
  path: 'admin-panel',
  loadComponent: () =>
    import('./app/pages/dashboard/dashboard').then(m => m.Dashboard),
  canActivate: [adminGuard]
},
  {
  path: 'usuario-panel',
  loadComponent: () =>
    import('./app/pages/usuario-panel.component').then((m) => m.UsuarioPanelComponent),
  canActivate: [userGuard],
},
  { path: '**', redirectTo: 'login' }
];