import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchFilters } from '../../services/search.service';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="space-y-4">
        <!-- Barra de Busca Principal -->
        <div class="flex gap-2">
          <div class="flex-1 relative">
            <input
              [(ngModel)]="filters.query"
              (ngModelChange)="onSearchChange()"
              type="text"
              placeholder="🔍 Buscar..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div
              *ngIf="suggestions.length > 0"
              class="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10"
            >
              <div
                *ngFor="let suggestion of suggestions"
                (click)="selectSuggestion(suggestion)"
                class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {{ suggestion }}
              </div>
            </div>
          </div>
          <button
            (click)="toggleAdvancedFilters()"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
          >
            ⚙️ Filtros
          </button>
          <button
            (click)="clearFilters()"
            class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors font-medium"
          >
            ✕ Limpar
          </button>
        </div>

        <!-- Filtros Avançados -->
        <div *ngIf="showAdvancedFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <!-- Filtro por Categoria -->
          <div *ngIf="showCategoryFilter">
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              [(ngModel)]="filters.category"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as categorias</option>
              <option *ngFor="let cat of categories" [value]="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <!-- Filtro por Preço -->
          <div *ngIf="showPriceFilter">
            <label class="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
            <input
              [(ngModel)]="filters.minPrice"
              (ngModelChange)="onFilterChange()"
              type="number"
              placeholder="0.00"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div *ngIf="showPriceFilter">
            <label class="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
            <input
              [(ngModel)]="filters.maxPrice"
              (ngModelChange)="onFilterChange()"
              type="number"
              placeholder="999.99"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <!-- Filtro por Status -->
          <div *ngIf="showStatusFilter">
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              [(ngModel)]="filters.status"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="sent">Enviado</option>
              <option value="completed">Pronto</option>
              <option value="closed">Fechado</option>
            </select>
          </div>

          <!-- Filtro por Role -->
          <div *ngIf="showRoleFilter">
            <label class="block text-sm font-medium text-gray-700 mb-2">Função</label>
            <select
              [(ngModel)]="filters.role"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas as funções</option>
              <option value="MANAGER">Gerente</option>
              <option value="WAITER">Garçom</option>
              <option value="KITCHEN">Cozinha</option>
            </select>
          </div>

          <!-- Ordenação -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              [(ngModel)]="filters.sortBy"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Padrão</option>
              <option value="name">Nome</option>
              <option value="price">Preço</option>
              <option value="date">Data</option>
              <option value="status">Status</option>
            </select>
          </div>

          <!-- Ordem -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
            <select
              [(ngModel)]="filters.sortOrder"
              (ngModelChange)="onFilterChange()"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class AdvancedSearchComponent implements OnInit {
  @Input() showCategoryFilter = false;
  @Input() showPriceFilter = false;
  @Input() showStatusFilter = false;
  @Input() showRoleFilter = false;
  @Input() categories: any[] = [];
  @Output() filtersChanged = new EventEmitter<SearchFilters>();

  filters: SearchFilters = {
    query: '',
    sortOrder: 'asc',
  };

  suggestions: string[] = [];
  showAdvancedFilters = false;

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService.getFilters().subscribe((filters) => {
      this.filters = filters;
    });
  }

  onSearchChange(): void {
    this.searchService.setFilters(this.filters);
    this.filtersChanged.emit(this.filters);
  }

  onFilterChange(): void {
    this.searchService.setFilters(this.filters);
    this.filtersChanged.emit(this.filters);
  }

  toggleAdvancedFilters(): void {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }

  clearFilters(): void {
    this.filters = {
      query: '',
      sortOrder: 'asc',
    };
    this.searchService.clearFilters();
    this.filtersChanged.emit(this.filters);
  }

  selectSuggestion(suggestion: string): void {
    this.filters.query = suggestion;
    this.suggestions = [];
    this.onSearchChange();
  }
}

