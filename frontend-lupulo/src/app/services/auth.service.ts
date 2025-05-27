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
    }

    obtenerToken(): string | null {
        return localStorage.getItem('token');
    }

    eliminarToken(): void {
        localStorage.removeItem('token');
    }

    estaAutenticado(): boolean {
        return !!this.obtenerToken();
    }
    /**
     * Decodifica el JWT que tienes en localStorage y devuelve el claim 'rol'
     */
    obtenerRol(): string | null {
        const token = this.obtenerToken();
        if (!token) {
            return null;
        }
        try {
            // La parte central del JWT es el payload base64
            const payload = JSON.parse(atob(token.split('.')[1]));
            // Asumimos que el backend puso { ..., rol: 'USER' } en los claims
            return payload.rol ?? null;
        } catch (e) {
            console.error('Error decodificando token JWT:', e);
            return null;
        }
    }
    /**
     * Decodifica el JWT y devuelve el email del usuario (claim 'sub' o 'email')
     */
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
}
