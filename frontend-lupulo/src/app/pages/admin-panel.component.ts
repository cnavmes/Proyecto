import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from '../layout/component/app.topbar';
import { AppMenu } from '../layout/component/app.menu';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, RouterModule, AppTopbar, AppMenu],
    template: `
        <div class="layout-wrapper">
            <app-topbar />
            <div class="layout-sidebar">
                <app-menu />
            </div>
            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `
})
export class AdminPanelComponent implements OnInit {
    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.http.get('/api/auth/me').subscribe({
            next: (data) => console.log('Respuesta /api/auth/me:', data),
            error: (err) => console.error('Error /api/auth/me:', err)
        });
    }
}
