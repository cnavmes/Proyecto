import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DashboardService, Cerveza } from '../../services/dashboard.service';

@Component({
    selector: 'app-catalogo-inventario',
    standalone: true,
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, ToastModule, ToolbarModule, ConfirmDialogModule],
    template: `
        <p-toolbar styleClass="mb-6">
            <ng-template #start>
                <p-button label="Nueva" icon="pi pi-plus" severity="secondary" class="mr-2" (onClick)="openNew()" />
                <p-button label="Eliminar" icon="pi pi-trash" severity="secondary" outlined (onClick)="deleteSelected()" [disabled]="!selectedCervezas?.length" />
            </ng-template>
        </p-toolbar>

        <p-table #dt [value]="cervezas()" [paginator]="true" [rows]="10" [(selection)]="selectedCervezas" dataKey="id" [rowHover]="true">
            <ng-template pTemplate="header">
                <tr>
                    <th style="width: 3rem"><p-tableHeaderCheckbox /></th>
                    <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre" /></th>
                    <th pSortableColumn="estilo">Estilo <p-sortIcon field="estilo" /></th>
                    <th pSortableColumn="graduacion">Graduación <p-sortIcon field="graduacion" /></th>
                    <th pSortableColumn="paisOrigen">País <p-sortIcon field="paisOrigen" /></th>
                    <th pSortableColumn="precio">Precio <p-sortIcon field="precio" /></th>
                    <th pSortableColumn="stock">Stock <p-sortIcon field="stock" /></th>
                    <th></th>
                </tr>
            </ng-template>

            <ng-template pTemplate="body" let-cerveza>
                <tr [ngStyle]="cerveza.stock < 10 ? { 'background-color': '#7f1d1d20' } : {}">
                    <td><p-tableCheckbox [value]="cerveza" /></td>
                    <td>{{ cerveza.nombre }}</td>
                    <td>{{ cerveza.estilo }}</td>
                    <td>{{ cerveza.graduacion }}°</td>
                    <td>{{ cerveza.paisOrigen }}</td>
                    <td>{{ cerveza.precio | currency: 'EUR' }}</td>
                    <td>
                        <span class="flex items-center gap-2 justify-end">
                            <span [ngClass]="{ 'text-red-500 font-semibold': cerveza.stock < 10 }">{{ cerveza.stock }}</span>
                            <i *ngIf="cerveza.stock < 10" class="pi pi-exclamation-triangle text-red-500" title="Stock bajo"></i>
                        </span>
                    </td>
                    <td>
                        <p-button icon="pi pi-pencil" (click)="editCerveza(cerveza)" class="mr-2" rounded outlined />
                        <p-button icon="pi pi-trash" (click)="deleteCerveza(cerveza)" severity="danger" rounded outlined />
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog *ngIf="cerveza" header="Datos de la cerveza" [(visible)]="cervezaDialog" [modal]="true" [style]="{ width: '450px' }">
            <div class="flex flex-col gap-4">
                <div><label>Nombre</label><input pInputText [(ngModel)]="cerveza.nombre" required /></div>
                <div><label>Estilo</label><input pInputText [(ngModel)]="cerveza.estilo" /></div>
                <div><label>Graduación</label><p-inputnumber [(ngModel)]="cerveza.graduacion" suffix="°" mode="decimal" /></div>
                <div><label>País de origen</label><input pInputText [(ngModel)]="cerveza.paisOrigen" /></div>
                <div><label>Precio</label><p-inputnumber [(ngModel)]="cerveza.precio" mode="currency" currency="EUR" /></div>
                <div><label>Stock</label><p-inputnumber [(ngModel)]="cerveza.stock" /></div>
                <div><label>Descripción</label><textarea pInputText [(ngModel)]="cerveza.descripcion"></textarea></div>
                <div><label>URL de imagen</label><input pInputText [(ngModel)]="cerveza.imagenUrl" /></div>
                <div><label>Código de barras</label><input pInputText [(ngModel)]="cerveza.codigoBarras" /></div>
            </div>

            <ng-template pTemplate="footer">
                <p-button label="Cancelar" icon="pi pi-times" text (click)="hideDialog()" />
                <p-button label="Guardar" icon="pi pi-check" (click)="saveCerveza()" />
            </ng-template>
        </p-dialog>

        <p-toast />
        <p-confirmdialog />
    `,
    providers: [ConfirmationService, MessageService]
})
export class CatalogoInventarioComponent implements OnInit {
    cervezas = signal<Cerveza[]>([]);
    cervezaDialog: boolean = false;
    cerveza!: Cerveza;
    selectedCervezas: Cerveza[] = [];
    submitted = false;

    @ViewChild('dt') dt!: Table;

    constructor(
        private dashboardService: DashboardService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cargarCervezas();
    }

    cargarCervezas() {
        this.dashboardService.getCervezas(0, 100).subscribe((res) => {
            this.cervezas.set(res.cervezas);
        });
    }

    openNew() {
        this.cerveza = {} as Cerveza;
        this.submitted = false;
        this.cervezaDialog = true;
    }

    editCerveza(c: Cerveza) {
        this.cerveza = { ...c };
        this.cervezaDialog = true;
    }

    deleteCerveza(c: Cerveza) {
        this.confirmationService.confirm({
            message: `¿Seguro que quieres eliminar la cerveza "${c.nombre}"?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.dashboardService.eliminarCerveza(c.id).subscribe(() => {
                    this.cargarCervezas();
                    this.messageService.add({ severity: 'success', summary: 'Eliminada', detail: c.nombre });
                });
            }
        });
    }

    deleteSelected() {
        this.confirmationService.confirm({
            message: '¿Eliminar cervezas seleccionadas?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedCervezas.forEach((c) =>
                    this.dashboardService.eliminarCerveza(c.id).subscribe(() => {
                        this.cargarCervezas();
                    })
                );
                this.selectedCervezas = [];
                this.messageService.add({ severity: 'success', summary: 'Eliminadas', detail: 'Cervezas eliminadas' });
            }
        });
    }

    saveCerveza() {
        this.submitted = true;
        if (!this.cerveza.nombre?.trim()) return;

        const operacion = this.cerveza.id ? this.dashboardService.actualizarCerveza(this.cerveza.id, this.cerveza) : this.dashboardService.crearCerveza(this.cerveza);

        operacion.subscribe(() => {
            this.cargarCervezas();
            this.cervezaDialog = false;
            this.messageService.add({
                severity: 'success',
                summary: 'Guardado',
                detail: this.cerveza.id ? 'Cerveza actualizada' : 'Cerveza creada'
            });
        });
    }

    hideDialog() {
        this.cervezaDialog = false;
    }
}
