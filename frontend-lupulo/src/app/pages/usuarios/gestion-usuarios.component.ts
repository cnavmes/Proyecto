import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuariosService, Usuario } from '../../services/usuarios.service';

@Component({
    selector: 'app-gestion-usuarios',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, InputTextModule, ButtonModule, DropdownModule, ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="card">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold">Gestión de Usuarios</h2>
                <button pButton type="button" label="Nuevo Usuario" icon="pi pi-plus" (click)="abrirNuevoUsuario()"></button>
            </div>

            <p-table [value]="usuarios" [paginator]="true" [rows]="5" responsiveLayout="scroll">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-usuario>
                    <tr>
                        <td>{{ usuario.email }}</td>
                        <td>{{ usuario.rol }}</td>
                        <td>
                            <button pButton icon="pi pi-pencil" class="mr-2" (click)="editarUsuario(usuario)"></button>
                            <button pButton icon="pi pi-trash" severity="danger" (click)="confirmarEliminacion(usuario)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-dialog header="Usuario" [(visible)]="mostrarDialogo" [modal]="true" [style]="{ width: '520px' }">
            <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label>Email</label>
                    <input pInputText [(ngModel)]="usuarioSeleccionado.email" type="email" required />
                </div>
                <div class="flex flex-col gap-1">
                    <label>Contraseña</label>
                    <input pInputText [(ngModel)]="usuarioSeleccionado.password" type="password" required />
                </div>
                <div class="flex flex-col gap-1">
                    <label>Rol</label>
                    <p-dropdown [options]="roles" [(ngModel)]="usuarioSeleccionado.rol" placeholder="Selecciona un rol" [appendTo]="'body'"></p-dropdown>
                </div>
            </div>

            <ng-template pTemplate="footer">
                <button pButton label="Cancelar" icon="pi pi-times" text (click)="mostrarDialogo = false"></button>
                <button pButton label="Guardar" icon="pi pi-check" (click)="guardarUsuario()"></button>
            </ng-template>
        </p-dialog>

        <p-toast />
        <p-confirmdialog />
    `
})
export class GestionUsuariosComponent implements OnInit {
    usuarios: Usuario[] = [];
    usuarioSeleccionado: Usuario = { email: '', password: '', rol: '' };
    mostrarDialogo = false;
    roles = ['USER', 'ADMIN'];

    constructor(
        private usuariosService: UsuariosService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.cargarUsuarios();
    }

    cargarUsuarios(): void {
        this.usuariosService.obtenerUsuarios().subscribe((data) => {
            this.usuarios = data;
        });
    }

    abrirNuevoUsuario(): void {
        this.usuarioSeleccionado = { email: '', password: '', rol: '' };
        this.mostrarDialogo = true;
    }

    editarUsuario(usuario: Usuario): void {
        this.usuarioSeleccionado = { ...usuario, password: '' };
        this.mostrarDialogo = true;
    }

    guardarUsuario(): void {
        if (this.usuarioSeleccionado.email && this.usuarioSeleccionado.rol) {
            const esNuevo = !this.usuarioSeleccionado.id;

            const operacion = esNuevo ? this.usuariosService.crearUsuario(this.usuarioSeleccionado) : this.usuariosService.actualizarUsuario(this.usuarioSeleccionado.id!, this.usuarioSeleccionado);

            operacion.subscribe(() => {
                this.mostrarDialogo = false;
                this.cargarUsuarios();
                this.messageService.add({
                    severity: 'success',
                    summary: esNuevo ? 'Usuario creado' : 'Usuario modificado',
                    detail: this.usuarioSeleccionado.email
                });
            });
        }
    }

    confirmarEliminacion(usuario: Usuario): void {
        this.confirmationService.confirm({
            message: `¿Seguro que quieres eliminar a ${usuario.email}?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => this.eliminarUsuario(usuario)
        });
    }

    eliminarUsuario(usuario: Usuario): void {
        if (usuario.id) {
            this.usuariosService.borrarUsuario(usuario.id).subscribe(() => {
                this.cargarUsuarios();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Usuario borrado',
                    detail: usuario.email
                });
            });
        }
    }
}
