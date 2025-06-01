import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const estaAutenticado = authService.estaAutenticado();
    const rol = authService.obtenerRol();
    const urlIntentada = route.url.map((segment) => segment.path).join('/');

    console.log('[GUARD] ¿Autenticado?:', estaAutenticado);
    console.log('[GUARD] Rol decodificado:', rol);
    console.log('[GUARD] Intentando acceder a:', urlIntentada);

    if (!estaAutenticado) {
        return router.parseUrl('/login');
    }

    if (rol === 'ADMIN') {
        return true;
    }

    // Usuario normal
    if (rol === 'USER') {
        // Bloquear rutas prohibidas
        if (urlIntentada === 'usuarios' || urlIntentada === 'estadisticas') {
            return router.parseUrl('/admin/dashboard');
        }
        return true;
    }

    // En cualquier otro caso, redirigir
    return router.parseUrl('/login');
};
