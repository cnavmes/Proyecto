import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.estaAutenticado() && authService.obtenerRol() === 'USER') {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};