import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { VentaService } from '../../services/venta.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-estadisticas',
    standalone: true,
    imports: [CommonModule, FormsModule, CalendarModule, ButtonModule, ChartModule, TableModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="card">
            <h2 class="text-xl font-semibold mb-4">Estadísticas</h2>

            <div class="flex flex-wrap gap-4 mb-4">
                <div class="flex flex-col">
                    <label for="fechaInicio">Desde</label>
                    <p-calendar [(ngModel)]="fechaInicio" inputId="fechaInicio" dateFormat="dd/mm/yy" showIcon></p-calendar>
                </div>
                <div class="flex flex-col">
                    <label for="fechaFin">Hasta</label>
                    <p-calendar [(ngModel)]="fechaFin" inputId="fechaFin" dateFormat="dd/mm/yy" showIcon></p-calendar>
                </div>
                <div class="flex items-end gap-2">
                    <button pButton type="button" label="Consultar" icon="pi pi-search" (click)="consultarEstadisticas()"></button>
                    <button pButton type="button" label="Limpiar" icon="pi pi-times" class="p-button-secondary" (click)="limpiarFechas()"></button>
                </div>
            </div>

            <div *ngIf="ventas.length > 0" class="flex flex-wrap justify-center gap-4 mb-6 text-center">
                <div class="p-4 rounded-xl shadow bg-green-900/30 text-white min-w-[200px]">
                    <i class="pi pi-euro text-xl mb-2 block"></i>
                    <div class="text-sm font-medium">Total Ventas (€)</div>
                    <div class="text-xl font-semibold">{{ totalIngresos | number: '1.2-2' }} €</div>
                </div>
                <div class="p-4 rounded-xl shadow bg-blue-900/30 text-white min-w-[200px]">
                    <i class="pi pi-shopping-cart text-xl mb-2 block"></i>
                    <div class="text-sm font-medium">Unidades Vendidas</div>
                    <div class="text-xl font-semibold">{{ totalUnidades }}</div>
                </div>
                <div class="p-4 rounded-xl shadow bg-yellow-900/30 text-white min-w-[200px]">
                    <i class="pi pi-tags text-xl mb-2 block"></i>
                    <div class="text-sm font-medium">Cervezas Diferentes</div>
                    <div class="text-xl font-semibold">{{ cervezasDiferentes }}</div>
                </div>
            </div>

            <div *ngIf="chartData" style="max-width: 800px; height: 400px; margin: 0 auto;">
                <p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>
            </div>

            <div class="mt-6">
                <p-table [value]="ventas">
                    <ng-template pTemplate="header">
                        <tr>
                            <th>Fecha</th>
                            <th>Cerveza</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Usuario</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-venta>
                        <tr>
                            <td>{{ venta.fecha }}</td>
                            <td>{{ venta.cerveza }}</td>
                            <td>{{ venta.cantidad }}</td>
                            <td>{{ venta.total | currency: 'EUR' }}</td>
                            <td>{{ venta.usuario }}</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

            <div class="mt-4 text-right">
                <button pButton type="button" label="Exportar a CSV" icon="pi pi-file" class="p-button-success" (click)="exportarCSV()"></button>
            </div>

            <p-toast></p-toast>
        </div>
    `
})
export class EstadisticasComponent implements OnInit {
    fechaInicio: Date | null = null;
    fechaFin: Date | null = null;
    ventas: any[] = [];
    chartData: any;
    chartOptions: any;

    totalIngresos: number = 0;
    totalUnidades: number = 0;
    cervezasDiferentes: number = 0;

    constructor(
        private ventaService: VentaService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Ventas por cerveza' }
            }
        };
    }

    consultarEstadisticas() {
        if (!this.fechaInicio || !this.fechaFin) {
            this.messageService.add({ severity: 'warn', summary: 'Fechas requeridas', detail: 'Selecciona un rango de fechas' });
            return;
        }

        const desde = this.formatearFecha(this.fechaInicio);
        const hasta = this.formatearFecha(this.fechaFin);

        this.ventaService.obtenerVentasPorFechas(desde, hasta).subscribe((data: any[]) => {
            if (data.length === 0) {
                this.messageService.add({ severity: 'info', summary: 'Sin resultados', detail: 'No hay ventas registradas en ese periodo' });
            }

            this.ventas = data.map((v: any) => ({
                ...v,
                total: v.cantidad * v.cerveza.precio,
                cerveza: v.cerveza.nombre,
                fecha: new Date(v.fecha).toLocaleString(),
                usuario: v.usuarioEmail
            }));

            this.totalIngresos = this.ventas.reduce((acc, curr) => acc + curr.total, 0);
            this.totalUnidades = this.ventas.reduce((acc, curr) => acc + curr.cantidad, 0);
            this.cervezasDiferentes = new Set(this.ventas.map((v) => v.cerveza)).size;

            const resumenPorCerveza: { [nombre: string]: number } = {};
            this.ventas.forEach((venta) => {
                resumenPorCerveza[venta.cerveza] = (resumenPorCerveza[venta.cerveza] || 0) + venta.total;
            });

            this.chartData = {
                labels: Object.keys(resumenPorCerveza),
                datasets: [
                    {
                        label: 'Total €',
                        backgroundColor: '#10b981',
                        data: Object.values(resumenPorCerveza)
                    }
                ]
            };
        });
    }

    limpiarFechas() {
        this.fechaInicio = null;
        this.fechaFin = null;
        this.ventas = [];
        this.chartData = null;
        this.totalIngresos = 0;
        this.totalUnidades = 0;
        this.cervezasDiferentes = 0;
    }

    exportarCSV() {
        if (this.ventas.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No hay datos para exportar' });
            return;
        }

        const datos = this.ventas.map((v) => ({
            Fecha: v.fecha,
            Cerveza: v.cerveza,
            Cantidad: v.cantidad,
            Total: v.total,
            Usuario: v.usuario
        }));

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
        const workbook: XLSX.WorkBook = { Sheets: { Ventas: worksheet }, SheetNames: ['Ventas'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'csv', type: 'array' });

        const desdeStr = this.formatearFecha(this.fechaInicio!);
        const hastaStr = this.formatearFecha(this.fechaFin!);
        const nombreArchivo = `ventas_${desdeStr}_a_${hastaStr}.csv`;

        const blob = new Blob([excelBuffer], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, nombreArchivo);

        this.messageService.add({ severity: 'success', summary: 'Exportado', detail: `CSV generado: ${nombreArchivo}` });
    }

    private formatearFecha(fecha: Date): string {
        if (!(fecha instanceof Date)) {
            fecha = new Date(fecha);
        }

        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
