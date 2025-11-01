import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Order } from '../../services/data.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchTerm = '';
  filterStatus = 'all';
  sortBy = 'date-desc';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    let filtered = [...this.orders];

    // Filter by status
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter((order) => order.status === this.filterStatus);
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.customer_name?.toLowerCase().includes(term) ||
          order.table_number?.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price-asc':
          return a.total_price - b.total_price;
        case 'price-desc':
          return b.total_price - a.total_price;
        default:
          return 0;
      }
    });

    this.filteredOrders = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'open':
        return 'Aberta';
      case 'sent':
        return 'Enviada';
      case 'completed':
        return 'Pronta';
      case 'closed':
        return 'Fechada';
      default:
        return 'Desconhecido';
    }
  }

  getTotalOrders(): number {
    return this.filteredOrders.length;
  }

  getTotalRevenue(): number {
    return this.filteredOrders
      .filter((order) => order.status === 'closed')
      .reduce((sum, order) => sum + order.total_price, 0);
  }

  getAverageOrderValue(): number {
    const closedOrders = this.filteredOrders.filter((order) => order.status === 'closed');
    if (closedOrders.length === 0) return 0;
    return this.getTotalRevenue() / closedOrders.length;
  }
}

