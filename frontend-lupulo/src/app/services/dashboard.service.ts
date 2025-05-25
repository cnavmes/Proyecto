// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RevenueDTO {
    nombreCerveza: string;
    importe: number;
}

export interface Usuario {
    id: number;
    email: string;
    rol: string;
}

export interface Cerveza {
    id: number;
    nombre: string;
    estilo: string;
    graduacion: number;
    paisOrigen: string;
    precio: number;
    stock: number;
    descripcion: string;
    imagenUrl: string;
    codigoBarras: string;
}

export interface CervezaRespuestaDTO {
    cervezas: Cerveza[];
    pagina: number;
    totalPaginas: number;
    totalElementos: number;
}

export interface Venta {
    id: number;
    cerveza: Cerveza;
    cantidad: number;
    fecha: string;
    usuarioEmail: string;
}

export interface VentaRequest {
    cervezaId: number;
    cantidad: number;
}

export interface MovimientoStockDTO {
    nombreCerveza: string;
    cantidad: number;
    tipo: string;
    fecha: string;
    usuarioEmail: string;
}

export interface MovimientoStockRespuestaDTO {
    movimientos: MovimientoStockDTO[];
    pagina: number;
    totalPaginas: number;
    totalElementos: number;
}

export interface ReponerStockRequest {
    cantidad: number;
}

export interface DashboardStats {
    orders: number;
    revenue: number;
    customers: number;
    lowStock: number;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private apiCervezas = '/api/cervezas';
    private apiVentas = '/api/ventas';
    private apiMovimientos = '/api/movimientos';
    private apiDashboard = '/api/dashboard';

    constructor(private http: HttpClient) {}

    // ---------- Cervezas ----------
    getCervezas(page = 0, size = 10): Observable<CervezaRespuestaDTO> {
        const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        return this.http.get<CervezaRespuestaDTO>(this.apiCervezas, { params });
    }
    crearCerveza(c: Cerveza): Observable<Cerveza> {
        return this.http.post<Cerveza>(this.apiCervezas, c);
    }
    actualizarCerveza(id: number, c: Cerveza): Observable<Cerveza> {
        return this.http.put<Cerveza>(`${this.apiCervezas}/${id}`, c);
    }
    eliminarCerveza(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiCervezas}/${id}`);
    }
    getCervezaPorCodigo(barcode: string): Observable<Cerveza> {
        return this.http.get<Cerveza>(`${this.apiCervezas}/barcode/${barcode}`);
    }

    // ---------- Ventas ----------
    getVentas(): Observable<Venta[]> {
        return this.http.get<Venta[]>(this.apiVentas);
    }
    registrarVenta(r: VentaRequest): Observable<string> {
        return this.http.post<string>(this.apiVentas, r);
    }
    getVentasPorFechas(desde: string, hasta: string): Observable<Venta[]> {
        const params = new HttpParams().set('desde', desde).set('hasta', hasta);
        return this.http.get<Venta[]>(`${this.apiVentas}/filtro-fechas`, { params });
    }

    // ---------- Movimientos de stock ----------
    filtrarMovimientos(options: { page?: number; size?: number; tipo?: string; desde?: string; hasta?: string; usuarioEmail?: string; cervezaNombre?: string }): Observable<MovimientoStockRespuestaDTO> {
        let params = new HttpParams();
        if (options.page) params = params.set('page', options.page.toString());
        if (options.size) params = params.set('size', options.size.toString());
        if (options.tipo) params = params.set('tipo', options.tipo);
        if (options.desde) params = params.set('desde', options.desde);
        if (options.hasta) params = params.set('hasta', options.hasta);
        if (options.usuarioEmail) params = params.set('usuarioEmail', options.usuarioEmail);
        if (options.cervezaNombre) params = params.set('cervezaNombre', options.cervezaNombre);
        return this.http.get<MovimientoStockRespuestaDTO>(`${this.apiMovimientos}/filtro`, { params });
    }
    reponerStock(id: number, req: ReponerStockRequest): Observable<string> {
        return this.http.post<string>(`${this.apiMovimientos}/reponer/${id}`, req);
    }
    exportarMovimientos(): Observable<Blob> {
        return this.http.get(`${this.apiMovimientos}/exportar`, { responseType: 'blob' });
    }

    // ---------- Dashboard genérico ----------
    getStats(): Observable<DashboardStats> {
        return this.http.get<DashboardStats>(`${this.apiDashboard}/stats`);
    }
    getOrders(): Observable<Venta[]> {
        return this.http.get<Venta[]>(`${this.apiDashboard}/orders`);
    }
    getRevenueDetails(): Observable<RevenueDTO[]> {
        return this.http.get<RevenueDTO[]>(`${this.apiDashboard}/revenue-details`);
    }
    getAllUsers(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiDashboard}/users`);
    }
    getLowStockBeers(threshold = 10): Observable<Cerveza[]> {
        const params = new HttpParams().set('threshold', threshold.toString());
        return this.http.get<Cerveza[]>(`${this.apiDashboard}/low-stock`, { params });
    }
}
