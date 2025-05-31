import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Ventas</span>
                        <div class="text-surface-50 dark:text-surface-0 font-medium text-xl">{{ ordersToday }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Caja</span>
                        <div class="text-surface-50 dark:text-surface-0 font-medium text-xl">
                            {{ revenueToday | currency: 'EUR' : 'symbol' : '1.0-0' }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-euro text-orange-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Usuarios</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.customers || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Stock Bajo</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ stats?.lowStock || 0 }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-exclamation-triangle text-purple-500 !text-xl"></i>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class StatsWidget implements OnInit {
    stats?: DashboardStats;
    ordersToday = 0;
    revenueToday = 0;

    constructor(private dashboard: DashboardService) {}

    ngOnInit(): void {
        // Obtener datos generales
        this.dashboard.getStats().subscribe({
            next: (data: DashboardStats) => (this.stats = data),
            error: (err) => console.error('Error cargando stats generales:', err)
        });

        const hoy = new Date();
        const desde = hoy.toISOString().split('T')[0];

        const hastaDate = new Date(hoy);
        hastaDate.setDate(hastaDate.getDate() + 1);
        const hasta = hastaDate.toISOString().split('T')[0];

        this.dashboard.getVentasPorFechas(desde, hasta).subscribe({
            next: (ventas) => {
                this.ordersToday = ventas.length;
                this.revenueToday = ventas.reduce((total, v) => total + v.cerveza.precio * v.cantidad, 0);
            },
            error: (err) => console.error('Error cargando ventas del día:', err)
        });
    }
}
