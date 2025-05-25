import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { DashboardService } from '../../../services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule, CommonModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Ventas por Semana</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`
})
export class RevenueStreamWidget implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(
        public layoutService: LayoutService,
        private dashboardService: DashboardService
    ) {}

    ngOnInit() {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => this.cargarDatos());

        this.cargarDatos();
    }

    cargarDatos() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.dashboardService.getWeeklySales().subscribe({
            next: (data) => {
                console.log('📊 Datos recibidos del backend:', data);

                const labels = Object.keys(data);
                const values = Object.values(data);

                this.chartData = {
                    labels,
                    datasets: [
                        {
                            label: 'Total ventas',
                            data: values,
                            backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                            barThickness: 30,
                            borderRadius: 4
                        }
                    ]
                };

                this.chartOptions = {
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: 'transparent'
                            }
                        },
                        y: {
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: borderColor
                            }
                        }
                    }
                };
            },
            error: (err) => {
                console.error('❌ Error al cargar las ventas semanales:', err);
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
