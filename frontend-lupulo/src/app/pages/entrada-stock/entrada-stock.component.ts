import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { AuthService } from '../../services/auth.service';

interface Cerveza {
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

interface MovimientoStockDTO {
    nombreCerveza: string;
    cantidad: number;
    tipo: string;
    fecha: string;
    usuarioEmail: string;
}

@Component({
    selector: 'app-entrada-stock',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, CardModule, ToastModule, HttpClientModule, ChartModule],
    providers: [MessageService],
    template: `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <p-card header="Entrada de Stock">
                <div class="flex flex-col gap-3">
                    <label for="busqueda">Buscar cerveza (nombre o código de barras)</label>
                    <input id="busqueda" type="text" pInputText [(ngModel)]="terminoBusqueda" placeholder="Ej: IPA o 123456789" />
                    <button pButton label="Buscar" icon="pi pi-search" class="mt-2" (click)="buscarCerveza()"></button>
                </div>

                <ng-container *ngIf="cervezaEncontrada">
                    <div class="mt-5 flex flex-col gap-3">
                        <p><strong>Nombre:</strong> {{ cervezaEncontrada.nombre }}</p>
                        <p><strong>Stock actual:</strong> {{ cervezaEncontrada.stock }}</p>
                        <label for="cantidad">Cantidad a añadir:</label>
                        <div class="flex gap-2 items-center">
                            <input id="cantidad" type="number" pInputText [(ngModel)]="cantidad" min="1" style="width: 120px;" />
                            <button pButton label="Reponer stock" icon="pi pi-plus" (click)="reponerStock()"></button>
                        </div>
                    </div>
                </ng-container>

                <p *ngIf="noEncontrada" class="text-red-600 mt-4">La cerveza no está registrada. Por favor, créala primero en el inventario.</p>
            </p-card>

            <p-card header="Historial reciente de entradas">
                <div *ngIf="entradas.length === 0" class="text-gray-400">Aún no se han registrado entradas.</div>
                <ul *ngIf="entradas.length > 0" class="mb-3">
                    <li *ngFor="let entrada of entradas">
                        <strong>{{ entrada.nombreCerveza }}</strong> - {{ entrada.cantidad }} unidades - {{ entrada.fecha | date: 'short' }}
                    </li>
                </ul>
                <button pButton label="Exportar CSV" icon="pi pi-download" class="mt-2" (click)="exportarCSV()"></button>
            </p-card>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <p-card header="Entradas por Cerveza (Total acumulado)" class="flex flex-col justify-center">
                <div class="pt-8">
                    <p-chart type="bar" [data]="chartData" [options]="chartOptions" styleClass="w-full" style="height: 300px"></p-chart>
                </div>
            </p-card>

            <p-card>
                <ng-container *ngIf="cervezasBajoStock.length > 0">
                    <div class="flex items-center gap-2 text-orange-400 mb-2">
                        <i class="pi pi-exclamation-triangle text-orange-400"></i>
                        <span class="font-semibold">Cervezas con stock bajo <span class="text-xs">(menos de 10 unidades)</span>:</span>
                    </div>
                    <ul class="ml-4 text-sm text-gray-300">
                        <li *ngFor="let cerveza of cervezasBajoStock"><i class="pi pi-box mr-2 text-orange-300"></i>{{ cerveza.nombre }} ({{ cerveza.stock }} unidades)</li>
                    </ul>
                </ng-container>
                <ng-container *ngIf="cervezasBajoStock.length === 0">
                    <p class="text-sm text-gray-400">No hay cervezas con stock bajo</p>
                </ng-container>
            </p-card>
        </div>

        <p-toast />
    `
})
export class EntradaStockComponent implements OnInit {
    terminoBusqueda = '';
    cantidad: number = 0;
    cervezaEncontrada: Cerveza | null = null;
    noEncontrada = false;
    entradas: MovimientoStockDTO[] = [];
    chartData: any;
    chartOptions: any;
    cervezasBajoStock: Cerveza[] = [];

    constructor(
        private http: HttpClient,
        private messageService: MessageService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.cargarEntradas();
        this.cargarCervezas();
    }

    cargarCervezas() {
        this.http.get<{ cervezas: Cerveza[] }>(`/api/cervezas`).subscribe({
            next: (res) => {
                const todas = res.cervezas || [];
                this.cervezasBajoStock = todas.filter((c) => c.stock < 10);
            }
        });
    }

    cargarEntradas() {
        this.http.get<any>(`/api/movimientos/filtro?tipo=ENTRADA&page=0&size=50`).subscribe({
            next: (res) => {
                this.entradas = res.movimientos || [];
                this.actualizarGrafico();
            },
            error: () => {
                console.warn('⚠️ No se pudo cargar el historial de entradas.');
            }
        });
    }

    buscarCerveza() {
        this.noEncontrada = false;
        this.cervezaEncontrada = null;

        const termino = this.terminoBusqueda.trim().toLowerCase();
        if (!termino) {
            this.messageService.add({ severity: 'warn', summary: 'Campo vacío', detail: 'Introduce un nombre o código de barras.' });
            return;
        }

        this.http.get<any>(`/api/cervezas`).subscribe({
            next: (res) => {
                const cervezas: Cerveza[] = res.cervezas || [];
                const match = cervezas.find((c) => c.nombre?.toLowerCase().includes(termino) || c.codigoBarras === this.terminoBusqueda.trim());

                if (match) {
                    this.cervezaEncontrada = match;
                } else {
                    this.noEncontrada = true;
                    this.messageService.add({ severity: 'info', summary: 'No encontrada', detail: 'La cerveza no está registrada.' });
                }
            },
            error: (err) => {
                console.error('❌ Error buscando cerveza:', err);
                this.messageService.add({ severity: 'error', summary: 'Error de búsqueda', detail: 'No se pudo buscar la cerveza.' });
            }
        });
    }

    reponerStock() {
        if (!this.cervezaEncontrada || this.cantidad <= 0) {
            this.messageService.add({ severity: 'warn', summary: 'Datos inválidos', detail: 'Revisa la cantidad ingresada.' });
            return;
        }

        const body = {
            cantidad: this.cantidad,
            motivo: 'Entrada de stock manual desde panel'
        };

        this.http.post(`/api/movimientos/reponer/${this.cervezaEncontrada.id}`, body).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Stock repuesto',
                    detail: `Se han añadido ${this.cantidad} unidades.`
                });

                this.cervezaEncontrada!.stock += this.cantidad;
                this.agregarEntradaLocal(this.cervezaEncontrada!.nombre, this.cantidad);
                this.cantidad = 0;
                this.cargarCervezas();
            },
            error: (err) => {
                console.error('❌ Error al reponer stock:', err);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo reponer el stock.' });
            }
        });
    }

    agregarEntradaLocal(nombreCerveza: string, cantidad: number) {
        const email = this.authService.obtenerEmail() || 'usuario@desconocido.com';

        const nuevaEntrada: MovimientoStockDTO = {
            nombreCerveza,
            cantidad,
            tipo: 'ENTRADA',
            fecha: new Date().toISOString(),
            usuarioEmail: email
        };

        this.entradas.unshift(nuevaEntrada);
        if (this.entradas.length > 50) this.entradas.pop();
        this.actualizarGrafico();
    }

    exportarCSV() {
        if (this.entradas.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Sin datos', detail: 'No hay entradas recientes que exportar.' });
            return;
        }

        const datos = this.entradas.map((e) => ({
            Cerveza: e.nombreCerveza,
            Cantidad: e.cantidad,
            Fecha: new Date(e.fecha).toLocaleString(),
            Usuario: e.usuarioEmail
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);
        const workbook = { Sheets: { Entradas: worksheet }, SheetNames: ['Entradas'] };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        FileSaver.saveAs(blob, 'entradas_recientes_stock.xlsx');
    }

    actualizarGrafico() {
        const resumen: Record<string, number> = {};
        this.entradas.forEach((e) => {
            resumen[e.nombreCerveza] = (resumen[e.nombreCerveza] || 0) + e.cantidad;
        });

        this.chartData = {
            labels: Object.keys(resumen),
            datasets: [
                {
                    label: 'Unidades reingresadas',
                    backgroundColor: '#10B981',
                    data: Object.values(resumen)
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context: any) => `${context.dataset.label}: ${context.parsed.y} unidades`
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'top',
                    color: '#ffffff',
                    font: {
                        weight: 'bold'
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: '#ffffff' }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        };
    }
}
