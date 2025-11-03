import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, Order, Table } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
  tables: Table[] = [];
  orders: Order[] = [];
  showAddForm = false;
  tableForm!: FormGroup;
  readonly Plus = Plus;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTables();
    this.loadOrders();
  }

  initForm(): void {
    this.tableForm = this.fb.group({
      number: ['', [Validators.required]],
    });
  }

  loadTables(): void {
    this.dataService.getTables().subscribe((tables) => {
      this.tables = tables;
      this.updateTableStatus();
    });
  }

  private loadOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.orders = orders;
      this.updateTableStatus();
    });
  }

  private updateTableStatus(): void {
    this.tables.forEach((table) => {
      const order = this.orders.find((o) => o.table_number === table.number && o.status === 'open');
      if (order) {
        table.status = 'occupied';
        table.order = order;
      } else {
        table.status = 'available';
        table.order = undefined;
      }
    });
  }

  openAddTableForm(): void {
    this.showAddForm = true;
    this.tableForm.reset();
  }

  closeAddForm(): void {
    this.showAddForm = false;
    this.tableForm.reset();
  }

  onSubmit(): void {
    if (this.tableForm.invalid) {
      this.notificationService.error('Por favor, preencha o número da mesa');
      return;
    }

    const newTable: Table = {
      id: `table-${Date.now()}`,
      number: this.tableForm.value.number,
      status: 'available',
    };

    this.dataService.addTable(newTable);
    this.notificationService.success('Mesa adicionada com sucesso!');
    this.closeAddForm();
    this.loadTables();
  }

  deleteTable(tableId: string, event: Event): void {
    event.stopPropagation(); // Prevenir click no card

    if (confirm('Tem certeza que deseja remover esta mesa?')) {
      this.dataService.deleteTable(tableId);
      this.notificationService.success('Mesa removida com sucesso!');
      this.loadTables();
    }
  }

  handleTableClick(table: Table): void {
    if (table.status === 'occupied' && table.order) {
      // Navegar para a comanda
      this.router.navigate(['/dashboard'], {
        queryParams: { orderId: table.order.id }
      });
    }
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

