import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 text-center">
      <h1 class="text-3xl font-bold">Bienvenido al panel de usuario</h1>
      <p>Esta sección es solo accesible para usuarios autenticados con rol <strong>USER</strong>.</p>
    </div>
  `
})
export class UsuarioPanelComponent {}