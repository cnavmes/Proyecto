// src/app/pages/admin-panel.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  template: `<h1>Bienvenido al panel de administración</h1>`,
})
export class AdminPanelComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Esta petición PASARÁ por tu interceptor
    this.http.get('/api/auth/me').subscribe({
      next: data => console.log('Respuesta /api/auth/me:', data),
      error: err => console.error('Error /api/auth/me:', err)
    });
  }
}
