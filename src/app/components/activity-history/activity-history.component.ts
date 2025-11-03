import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Activity } from '../../models';
import { ActivitiesService } from '../../services/activities.service';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-activity-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Filters -->
      <div class="card">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filtrar por tipo</label>
            <select
              [(ngModel)]="selectedType"
              (change)="filterActivities()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              <option value="order">📋 Pedidos</option>
              <option value="product">🍽️ Produtos</option>
              <option value="employee">👤 Funcionários</option>
              <option value="table">🪑 Mesas</option>
              <option value="payment">💳 Pagamentos</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <select
              [(ngModel)]="selectedPeriod"
              (change)="filterActivities()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="today">Hoje</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="all">Todos</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Activities List -->
      <div class="space-y-3">
        <div
          *ngFor="let activity of paginatedActivities"
          class="card group hover:shadow-lg transition-all cursor-pointer animate-slide-up"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform"
              [ngClass]="{
                'bg-secondary-100': activity.badge_type === 'success',
                'bg-primary-100': activity.badge_type === 'info',
                'bg-accent-100': activity.badge_type === 'warning',
                'bg-red-100': activity.badge_type === 'danger',
                'bg-blue-100': activity.badge_type === 'primary'
              }"
            >
              {{ activity.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ activity.action }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.description }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ formatTime(activity.timestamp) }}</p>
                </div>
                <span
                  class="badge whitespace-nowrap flex-shrink-0"
                  [ngClass]="{
                    'badge-success': activity.badge_type === 'success',
                    'badge-info': activity.badge_type === 'info',
                    'badge-warning': activity.badge_type === 'warning',
                    'badge-danger': activity.badge_type === 'danger',
                    'badge-primary': activity.badge_type === 'primary'
                  }"
                >
                  {{ getTypeLabel(activity.type) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="paginatedActivities.length === 0" class="card text-center py-12">
          <p class="text-gray-500 text-lg">📭 Nenhuma atividade encontrada</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="totalPages > 1" class="flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a
          {{ Math.min(currentPage * itemsPerPage, filteredActivities.length) }} de
          {{ filteredActivities.length }}
        </p>
        <div class="flex gap-2">
          <button
            (click)="previousPage()"
            [disabled]="currentPage === 1"
            class="btn btn-sm"
            [class.opacity-50]="currentPage === 1"
          >
            ← Anterior
          </button>
          <div class="flex items-center gap-1">
            <button
              *ngFor="let page of getPageNumbers()"
              (click)="goToPage(page)"
              [class.bg-primary-600]="page === currentPage"
              [class.text-white]="page === currentPage"
              [class.bg-gray-200]="page !== currentPage"
              class="w-8 h-8 rounded text-sm font-medium transition-all"
            >
              {{ page }}
            </button>
          </div>
          <button
            (click)="nextPage()"
            [disabled]="currentPage === totalPages"
            class="btn btn-sm"
            [class.opacity-50]="currentPage === totalPages"
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class ActivityHistoryComponent implements OnInit {
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  paginatedActivities: Activity[] = [];

  selectedType = '';
  selectedPeriod = 'today';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  Math = Math;

  constructor(
    private activitiesService: ActivitiesService,
    private paginationService: PaginationService
  ) {}

  ngOnInit(): void {
    this.activitiesService.getActivities().subscribe((activities) => {
      this.activities = activities;
      this.filterActivities();
    });
  }

  filterActivities(): void {
    let filtered = [...this.activities];

    // Filter by type
    if (this.selectedType) {
      filtered = filtered.filter((a) => a.type === this.selectedType);
    }

    // Filter by period
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    if (this.selectedPeriod === 'today') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= today);
    } else if (this.selectedPeriod === 'week') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= weekAgo);
    } else if (this.selectedPeriod === 'month') {
      filtered = filtered.filter((a) => new Date(a.timestamp) >= monthAgo);
    }

    this.filteredActivities = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredActivities.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedActivities = this.filteredActivities.slice(start, end);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = Math.min(5, this.totalPages);
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPages - 1);

    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `Há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Há ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `Há ${days} dia${days > 1 ? 's' : ''}`;

    return new Date(date).toLocaleDateString('pt-BR');
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      order: '📋 Pedido',
      product: '🍽️ Produto',
      employee: '👤 Funcionário',
      table: '🪑 Mesa',
      payment: '💳 Pagamento',
    };
    return labels[type] || type;
  }
}

