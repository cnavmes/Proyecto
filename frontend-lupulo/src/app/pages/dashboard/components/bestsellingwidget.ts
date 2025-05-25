import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DashboardService, RevenueDTO } from '../../../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-6">
                <div class="font-semibold text-xl">Productos más vendidos</div>
                <div>
                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                    <p-menu #menu [popup]="true" [model]="items"></p-menu>
                </div>
            </div>
            <ul class="list-none p-0 m-0" *ngIf="productos.length">
                <li *ngFor="let producto of productos" class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                        <span class="text-surface-900 dark:text-surface-0 font-medium">{{ producto.nombreCerveza }}</span>
                        <div class="mt-1 text-muted-color">
                            {{ producto.importe | currency: 'EUR' : 'symbol' : '1.0-0' }}
                        </div>
                    </div>
                    <div class="mt-2 md:mt-0 flex items-center">
                        <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40" style="height: 8px">
                            <div class="bg-orange-500 h-full" [style.width.%]="getPorcentaje(producto.importe)"></div>
                        </div>
                        <span class="text-orange-500 ml-4 font-medium">{{ getPorcentaje(producto.importe) | number: '1.0-0' }}%</span>
                    </div>
                </li>
            </ul>
            <p *ngIf="!productos.length" class="text-muted-color">No hay datos aún</p>
        </div>
    `
})
export class BestSellingWidget implements OnInit {
    productos: RevenueDTO[] = [];
    totalIngresos: number = 0;

    items = [{ label: 'Refrescar', icon: 'pi pi-fw pi-refresh', command: () => this.cargarDatos() }];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.cargarDatos();
    }

    cargarDatos(): void {
        this.dashboardService.getRevenueDetails().subscribe({
            next: (datos) => {
                this.productos = datos.sort((a, b) => b.importe - a.importe);
                this.totalIngresos = this.productos.reduce((sum, p) => sum + p.importe, 0);
            },
            error: (err) => console.error('Error al cargar productos más vendidos:', err)
        });
    }

    getPorcentaje(importe: number): number {
        return this.totalIngresos > 0 ? (importe / this.totalIngresos) * 100 : 0;
    }
}
