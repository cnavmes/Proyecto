import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule, MessagesModule, MessageModule, TooltipModule],
    template: `
        <!-- Login en modo oscuro forzado -->
        <div class="bg-surface-950 flex items-center justify-center min-h-screen w-full">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33,150,243,0) 30%)">
                    <div class="w-full bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <div class="flex justify-center my-8">
                                <img src="/assets/logo.png" alt="Logo Un Mar de Lúpulo" class="h-48 w-auto" />
                            </div>
                            <div class="text-surface-50 text-3xl font-medium mb-4">Bienvenido a Un Mar de Lúpulo</div>
                            <span class="text-surface-200 font-medium">Inicia sesión para continuar</span>
                        </div>

                        <div>
                            <label for="email1" class="block text-surface-50 text-xl font-medium mb-2">Email</label>
                            <input pInputText id="email1" type="text" placeholder="Correo electrónico" class="w-full md:w-[30rem] mb-8 bg-surface-800 text-surface-50" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-50 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Contraseña" [toggleMask]="true" styleClass="mb-4 w-full bg-surface-800 text-surface-50" [fluid]="true" [feedback]="false"></p-password>

                            <p-button label="Iniciar sesión" styleClass="w-full" (click)="onSubmit()" [loading]="loading" [disabled]="loading"></p-button>

                            <p-messages [value]="messages" class="mt-4"></p-messages>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class LoginComponent {
    email = '';
    password = '';
    checked = false;
    loading = false;
    messages: CustomMessage[] = [];

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    onSubmit(): void {
        this.loading = true;
        this.messages = [];

        this.authService.login(this.email, this.password).subscribe({
            next: () => {
                const rol = this.authService.obtenerRol();
                this.router.navigate(['/admin/dashboard']);
            },
            error: () => {
                this.messages = [{ severity: 'error', summary: 'Error', detail: 'Email o contraseña incorrectos.' }];
                this.loading = false;
            },
            complete: () => (this.loading = false)
        });
    }
}

interface CustomMessage {
    severity?: 'success' | 'info' | 'warn' | 'error';
    summary?: string;
    detail?: string;
}
