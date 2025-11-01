import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Order } from '../../services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface StatisticCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Cards de Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          *ngFor="let stat of statistics"
          [ngClass]="'bg-' + stat.color + '-50 border-l-4 border-' + stat.color + '-500'"
          class="bg-white rounded-lg shadow-sm p-6 border-l-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm font-medium">{{ stat.title }}</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
              <p *ngIf="stat.trend" class="text-xs text-green-600 mt-1">{{ stat.trend }}</p>
            </div>
            <span class="text-4xl opacity-20">{{ stat.icon }}</span>
          </div>
        </div>
      </div>

      <!-- Gráfico de Vendas por Hora -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">📊 Vendas por Hora</h3>
        <div class="space-y-3">
          <div *ngFor="let hour of salesByHour" class="flex items-center gap-3">
            <span class="text-sm font-medium text-gray-600 w-12">{{ hour.time }}</span>
            <div class="flex-1 bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                [style.width.%]="hour.percentage"
              ></div>
            </div>
            <span class="text-sm font-medium text-gray-900">R$ {{ hour.value }}</span>
          </div>
        </div>
      </div>

      <!-- Produtos Mais Vendidos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">🏆 Top 5 Produtos</h3>
          <div class="space-y-3">
            <div *ngFor="let product of topProducts" class="flex items-center justify-between">
              <div class="flex-1">
                <p class="font-medium text-gray-900">{{ product.name }}</p>
                <p class="text-xs text-gray-600">{{ product.quantity }} vendidos</p>
              </div>
              <span class="text-lg font-bold text-primary-600">R$ {{ product.revenue }}</span>
            </div>
          </div>
        </div>

        <!-- Status dos Pedidos -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-bold text-gray-900 mb-4">📋 Status dos Pedidos</h3>
          <div class="space-y-3">
            <div *ngFor="let status of orderStatus" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-2xl">{{ status.icon }}</span>
                <p class="font-medium text-gray-900">{{ status.label }}</p>
              </div>
              <span class="text-lg font-bold" [ngClass]="status.colorClass">
                {{ status.count }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Receita Diária -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">💰 Receita Diária</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p class="text-gray-600 text-sm">Total do Dia</p>
            <p class="text-2xl font-bold text-green-600 mt-2">R$ {{ dailyRevenue.total }}</p>
          </div>
          <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p class="text-gray-600 text-sm">Ticket Médio</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">R$ {{ dailyRevenue.average }}</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p class="text-gray-600 text-sm">Pedidos Completados</p>
            <p class="text-2xl font-bold text-purple-600 mt-2">{{ dailyRevenue.completedOrders }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class StatisticsDashboardComponent implements OnInit, OnDestroy {
  statistics: StatisticCard[] = [];
  salesByHour: any[] = [];
  topProducts: any[] = [];
  orderStatus: any[] = [];
  dailyRevenue: any = {};
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders) => {
        this.calculateStatistics(orders);
      });
  }

  private calculateStatistics(orders: Order[]): void {
    // Calcular estatísticas gerais
    const closedOrders = orders.filter((o) => o.status === 'closed');
    const totalRevenue = closedOrders.reduce((sum, o) => sum + o.total_price, 0);
    const averageOrder = closedOrders.length > 0 ? totalRevenue / closedOrders.length : 0;

    this.statistics = [
      {
        title: 'Total de Pedidos',
        value: orders.length,
        icon: '📋',
        color: 'blue',
        trend: '+12% vs ontem',
      },
      {
        title: 'Receita Total',
        value: `R$ ${totalRevenue.toFixed(2)}`,
        icon: '💰',
        color: 'green',
        trend: '+8% vs ontem',
      },
      {
        title: 'Ticket Médio',
        value: `R$ ${averageOrder.toFixed(2)}`,
        icon: '📊',
        color: 'purple',
        trend: '+5% vs ontem',
      },
      {
        title: 'Pedidos Completados',
        value: closedOrders.length,
        icon: '✅',
        color: 'green',
        trend: '+15% vs ontem',
      },
    ];

    // Simular vendas por hora
    this.salesByHour = [
      { time: '12:00', value: 245.5, percentage: 80 },
      { time: '13:00', value: 189.0, percentage: 60 },
      { time: '14:00', value: 312.0, percentage: 100 },
      { time: '15:00', value: 156.5, percentage: 50 },
      { time: '16:00', value: 234.0, percentage: 75 },
      { time: '17:00', value: 198.5, percentage: 65 },
    ];

    // Top produtos
    this.topProducts = [
      { name: 'Pizza Margherita', quantity: 12, revenue: 420.0 },
      { name: 'Hambúrguer Clássico', quantity: 15, revenue: 375.0 },
      { name: 'Frango à Parmegiana', quantity: 8, revenue: 256.0 },
      { name: 'Salmão Grelhado', quantity: 5, revenue: 225.0 },
      { name: 'Macarrão à Carbonara', quantity: 10, revenue: 280.0 },
    ];

    // Status dos pedidos
    const openCount = orders.filter((o) => o.status === 'open').length;
    const sentCount = orders.filter((o) => o.status === 'sent').length;
    const completedCount = orders.filter((o) => o.status === 'completed').length;
    const closedCount = orders.filter((o) => o.status === 'closed').length;

    this.orderStatus = [
      { label: 'Abertos', count: openCount, icon: '📝', colorClass: 'text-blue-600' },
      { label: 'Enviados', count: sentCount, icon: '📤', colorClass: 'text-yellow-600' },
      { label: 'Prontos', count: completedCount, icon: '✅', colorClass: 'text-green-600' },
      { label: 'Fechados', count: closedCount, icon: '🎉', colorClass: 'text-purple-600' },
    ];

    // Receita diária
    this.dailyRevenue = {
      total: totalRevenue.toFixed(2),
      average: averageOrder.toFixed(2),
      completedOrders: closedCount,
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

