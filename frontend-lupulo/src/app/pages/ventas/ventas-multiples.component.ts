import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, Cerveza, VentaRequest, Venta } from '../../services/dashboard.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-ventas-multiples',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule, TableModule, ToastModule, CardModule],
    providers: [MessageService],
    templateUrl: './ventas-multiples.component.html',
    styleUrls: ['./ventas-multiples.component.scss']
})
export class VentasMultiplesComponent implements OnInit {
    busqueda = '';
    cantidad = 1;
    cervezaEncontrada: Cerveza | null = null;
    cervezasSugeridas: Cerveza[] = [];
    carrito: { cervezaId: number; nombre: string; cantidad: number; precio: number }[] = [];
    mostrarTicket = false;
    fechaVenta = new Date();
    ventasRecientes: Venta[] = [];

    constructor(
        private dashboardService: DashboardService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cargarVentasRecientes();
    }

    buscarCerveza() {
        if (!this.busqueda.trim()) {
            this.cervezasSugeridas = [];
            return;
        }
        this.dashboardService.buscarCervezas(this.busqueda.trim()).subscribe({
            next: (cervezas) => {
                this.cervezasSugeridas = cervezas;
            },
            error: () => {
                this.cervezasSugeridas = [];
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar' });
            }
        });
    }

    seleccionarCerveza(cerveza: Cerveza) {
        this.cervezaEncontrada = cerveza;
        this.busqueda = cerveza.nombre;
        this.cervezasSugeridas = [];
    }

    agregarAlCarrito() {
        if (!this.cervezaEncontrada || this.cantidad < 1) return;

        if (this.cantidad > this.cervezaEncontrada.stock) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Stock insuficiente',
                detail: `Solo quedan ${this.cervezaEncontrada.stock} unidades de ${this.cervezaEncontrada.nombre}`
            });
            return;
        }

        this.carrito.push({
            cervezaId: this.cervezaEncontrada.id,
            nombre: this.cervezaEncontrada.nombre,
            cantidad: this.cantidad,
            precio: this.cervezaEncontrada.precio
        });

        this.messageService.add({
            severity: 'info',
            summary: 'Añadido al carrito',
            detail: `${this.cantidad} unidad(es) de ${this.cervezaEncontrada.nombre}`
        });

        this.cervezaEncontrada = null;
        this.busqueda = '';
        this.cantidad = 1;
    }

    quitarDelCarrito(index: number) {
        this.carrito.splice(index, 1);
    }

    registrarVentas() {
        const ventas: VentaRequest[] = this.carrito.map((item) => ({
            cervezaId: item.cervezaId,
            cantidad: item.cantidad
        }));
        this.dashboardService.registrarVentasMultiples({ ventas }).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Ventas registradas correctamente' });
                this.mostrarTicket = true;
                this.fechaVenta = new Date();
                this.cargarVentasRecientes();
            },
            error: (error) => {
                const mensaje = error?.error || 'No se pudieron registrar las ventas';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
            }
        });
    }

    cargarVentasRecientes() {
        this.dashboardService.getVentas().subscribe({
            next: (ventas) => {
                this.ventasRecientes = ventas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 10);
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las ventas recientes'
                });
            }
        });
    }

    calcularTotal(): number {
        return this.carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    }

    imprimirTicket() {
        const contenido = document.getElementById('ticket')?.innerHTML;
        const ventana = window.open('', '', 'height=600,width=400');
        if (ventana && contenido) {
            ventana.document.write(`
        <html><head><title>Ticket</title>
        <style>
          body { font-family: monospace; padding: 20px; }
          .logo { width: 80px; margin-bottom: 10px; }
          .total { font-weight: bold; margin-top: 10px; }
        </style>
        </head><body>
        ${contenido}
        </body></html>`);
            ventana.document.close();
            ventana.print();

            this.carrito = [];
            this.mostrarTicket = false;

            this.messageService.add({
                severity: 'info',
                summary: 'Listo',
                detail: 'Carrito vaciado tras imprimir ticket'
            });
        }
    }
}
