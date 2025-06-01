import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
            tap((res: AuthResponse) => {
                this.guardarToken(res.token);
            })
        );
    }

    guardarToken(token: string): void {
        localStorage.setItem('token', token);
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const rol = payload.rol ?? '';
            localStorage.setItem('rol', rol);
        } catch (e) {
            console.error('Error al extraer el rol del token:', e);
        }
    }

    obtenerToken(): string | null {
        return localStorage.getItem('token');
    }

    eliminarToken(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
    }

    estaAutenticado(): boolean {
        return !!this.obtenerToken();
    }

    obtenerRol(): string | null {
        return localStorage.getItem('rol');
    }

    obtenerEmail(): string | null {
        const token = this.obtenerToken();
        if (!token) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.email || null;
        } catch (e) {
            console.error('Error decodificando token JWT:', e);
            return null;
        }
    }

    // ✅ NUEVO MÉTODO: comprobar si el usuario es ADMIN
    esAdmin(): boolean {
        return this.obtenerRol() === 'ADMIN';
    }

    // ✅ NUEVO MÉTODO: comprobar si el usuario es USER
    esUsuario(): boolean {
        return this.obtenerRol() === 'USER';
    }
}
