import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Order } from '../../services/data.service';

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  order?: Order;
}

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
  tables: Table[] = [];
  orders: Order[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.initializeTables();
    this.loadOrders();
  }

  private initializeTables(): void {
    // Criar 12 mesas (4x3 layout)
    this.tables = Array.from({ length: 12 }, (_, i) => ({
      id: `table-${i + 1}`,
      number: i + 1,
      capacity: i % 3 === 0 ? 2 : i % 3 === 1 ? 4 : 6,
      status: 'available',
    }));
  }

  private loadOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.updateTableStatus();
    });
  }

  private updateTableStatus(): void {
    this.tables.forEach((table) => {
      const order = this.orders.find((o) => o.table_number === `Mesa ${table.number}`);
      if (order) {
        table.status = order.status === 'closed' ? 'available' : 'occupied';
        table.order = order;
      } else {
        table.status = 'available';
        table.order = undefined;
      }
    });
  }

  getTableIcon(capacity: number): string {
    if (capacity <= 2) return '🪑';
    if (capacity <= 4) return '🪑🪑';
    return '🪑🪑🪑';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'available':
        return 'bg-green-100 border-green-300';
      case 'occupied':
        return 'bg-red-100 border-red-300';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'available':
        return 'Disponível';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      default:
        return 'Desconhecido';
    }
  }
}

