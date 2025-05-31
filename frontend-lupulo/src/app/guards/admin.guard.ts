import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const estaAutenticado = authService.estaAutenticado();
    const rol = authService.obtenerRol();

    console.log('[GUARD] ¿Autenticado?:', estaAutenticado);
    console.log('[GUARD] Rol decodificado:', rol);

    // Solo permito si hay token y rol 'ADMIN'
    if (authService.estaAutenticado() && authService.obtenerRol() === 'ADMIN') {
        return true;
    }

    // Redirección segura
    return router.parseUrl('/login');
};
