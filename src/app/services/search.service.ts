import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category, Order, Employee } from './data.service';

export interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  role?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'name' | 'price' | 'date' | 'status';
  sortOrder?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private filters$ = new BehaviorSubject<SearchFilters>({
    query: '',
    sortOrder: 'asc',
  });

  constructor() {}

  setFilters(filters: Partial<SearchFilters>): void {
    const current = this.filters$.value;
    this.filters$.next({ ...current, ...filters });
  }

  getFilters(): Observable<SearchFilters> {
    return this.filters$.asObservable();
  }

  clearFilters(): void {
    this.filters$.next({
      query: '',
      sortOrder: 'asc',
    });
  }

  // Buscar produtos
  searchProducts(
    products: Product[],
    filters: SearchFilters
  ): Product[] {
    let results = [...products];

    // Filtro por query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((p) =>
        p.name.toLowerCase().includes(query)
      );
    }

    // Filtro por categoria
    if (filters.category) {
      results = results.filter((p) => p.category_id === filters.category);
    }

    // Filtro por preço
    if (filters.minPrice !== undefined) {
      results = results.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= filters.maxPrice!);
    }

    // Ordenação
    results = this.sortResults(results, filters.sortBy, filters.sortOrder);

    return results;
  }

  // Buscar pedidos
  searchOrders(
    orders: Order[],
    filters: SearchFilters
  ): Order[] {
    let results = [...orders];

    // Filtro por query (cliente, mesa, ID)
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((o) =>
        o.customer_name.toLowerCase().includes(query) ||
        o.table_number.toLowerCase().includes(query) ||
        o.id.toLowerCase().includes(query)
      );
    }

    // Filtro por status
    if (filters.status) {
      results = results.filter((o) => o.status === filters.status);
    }

    // Filtro por data
    if (filters.dateFrom) {
      results = results.filter((o) => new Date(o.created_at) >= filters.dateFrom!);
    }
    if (filters.dateTo) {
      results = results.filter((o) => new Date(o.created_at) <= filters.dateTo!);
    }

    // Ordenação
    if (filters.sortBy === 'date') {
      results.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else if (filters.sortBy === 'price') {
      results.sort((a, b) => {
        return filters.sortOrder === 'asc'
          ? a.total_price - b.total_price
          : b.total_price - a.total_price;
      });
    }

    return results;
  }

  // Buscar funcionários
  searchEmployees(
    employees: Employee[],
    filters: SearchFilters
  ): Employee[] {
    let results = [...employees];

    // Filtro por query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((e) =>
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query)
      );
    }

    // Filtro por role
    if (filters.role) {
      results = results.filter((e) => e.role === filters.role);
    }

    // Ordenação
    results = this.sortResults(results, filters.sortBy, filters.sortOrder);

    return results;
  }

  // Buscar categorias
  searchCategories(
    categories: Category[],
    filters: SearchFilters
  ): Category[] {
    let results = [...categories];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter((c) =>
        c.name.toLowerCase().includes(query)
      );
    }

    return results;
  }

  private sortResults(
    results: any[],
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): any[] {
    if (!sortBy) return results;

    return results.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Sugestões de busca
  getSearchSuggestions(
    items: any[],
    query: string,
    field: string = 'name'
  ): string[] {
    if (!query) return [];

    const queryLower = query.toLowerCase();
    const suggestions = items
      .filter((item) =>
        item[field].toLowerCase().includes(queryLower)
      )
      .map((item) => item[field])
      .slice(0, 5);

    return [...new Set(suggestions)];
  }
}

