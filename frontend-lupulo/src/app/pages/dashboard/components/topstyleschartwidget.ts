import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService, EstiloVentasDTO } from '../../../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-top-styles-chart-widget',
    imports: [CommonModule, ChartModule],
    template: `
        <div class="card !mb-8">
            <div class="font-semibold text-xl mb-4">Ventas por Estilo</div>
            <div class="flex justify-center items-center">
                <p-chart type="doughnut" [data]="chartData" [options]="chartOptions" style="max-width: 300px; height: auto;" />
            </div>
        </div>
    `
})
export class TopStylesChartWidget implements OnInit {
    chartData: any;
    chartOptions: any;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        this.dashboardService.getVentasPorEstilo().subscribe((data: EstiloVentasDTO[]) => {
            this.chartData = {
                labels: data.map((d) => d.estilo),
                datasets: [
                    {
                        data: data.map((d) => d.cantidad),
                        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#26C6DA', '#FF7043', '#EC407A', '#7E57C2', '#FFCA28'],
                        hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#BA68C8', '#4DD0E1', '#FF8A65', '#F06292', '#9575CD', '#FFD54F']
                    }
                ]
            };

            const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

            this.chartOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                }
            };
        });
    }
}
