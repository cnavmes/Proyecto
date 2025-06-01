import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venta {
    fecha: string;
    cerveza: string;
    cantidad: number;
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class VentaService {
    private apiUrl = 'http://localhost:8080/api/ventas';

    constructor(private http: HttpClient) {}

    obtenerVentasPorFechas(desde: string, hasta: string): Observable<Venta[]> {
        const params = new HttpParams().set('desde', desde).set('hasta', hasta);

        return this.http.get<Venta[]>(`${this.apiUrl}/filtro-fechas`, { params });
    }
}
