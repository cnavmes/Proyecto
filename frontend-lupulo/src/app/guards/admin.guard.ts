import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Solo permito si hay token y rol'ADMIN'
    if (authService.estaAutenticado() && authService.obtenerRol() === 'ADMIN') {
        return true;
    }

    // En cualquier otro caso, vuelvo al login
    router.navigate(['/login']);
    return false;
};
