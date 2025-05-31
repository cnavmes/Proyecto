import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { DashboardService, Venta } from '../../../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `
        <div class="card !mb-8">
            <div class="font-semibold text-xl mb-4">Ventas Recientes</div>
            <p-table [value]="ventas" [paginator]="true" [rows]="5" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Fecha</th>
                        <th>Usuario</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-venta>
                    <tr>
                        <td>{{ venta.cerveza.nombre }}</td>
                        <td>{{ venta.cantidad }}</td>
                        <td>{{ venta.fecha | date: 'short' }}</td>
                        <td>{{ venta.usuarioEmail }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `
})
export class RecentSalesWidget implements OnInit {
    ventas: Venta[] = [];

    constructor(private dashboard: DashboardService) {}

    ngOnInit(): void {
        this.dashboard.getOrders().subscribe({
            next: (data: Venta[]) => {
                // Ordenar por fecha descendente
                this.ventas = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
            },
            error: (err: any) => console.error('Error loading sales:', err)
        });
    }
}
