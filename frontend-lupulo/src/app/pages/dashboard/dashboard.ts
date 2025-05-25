import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ①
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { NotificationsWidget } from './components/notificationswidget';
import { DashboardService, Cerveza } from '../../services/dashboard.service'; // ②
import { DialogModule } from 'primeng/dialog';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [
        CommonModule, // necesario para *ngFor
        StatsWidget,
        RecentSalesWidget,
        BestSellingWidget,
        RevenueStreamWidget,
        NotificationsWidget,
        DialogModule
    ],
    template: `
        <!-- Diálogo fuera de la rejilla -->
        <p-dialog header="Cervezas con stock bajo" [(visible)]="visible" [modal]="true" [style]="{ width: '30vw' }" appendTo="body">
            <ul class="p-pl-4 p-m-0">
                <li *ngFor="let c of lowStockItems">{{ c.nombre }} — stock: {{ c.stock }}</li>
            </ul>
        </p-dialog>

        <!-- Tu grid intacto -->
        <div class="grid grid-cols-12 gap-8">
            <!-- dispara openLowStock() cuando clicas la tarjeta -->
            <app-stats-widget class="contents" (lowStock)="openLowStock()"></app-stats-widget>

            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>

            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `
})
export class Dashboard {
    visible = false;
    lowStockItems: Cerveza[] = [];

    constructor(private dashboardService: DashboardService) {}

    openLowStock(): void {
        this.dashboardService
            .getLowStockBeers(10) // usa el endpoint que devuelve Cerveza[]
            .subscribe((items) => {
                this.lowStockItems = items;
                this.visible = true;
            });
    }
}
