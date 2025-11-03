import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Order, OrderItem, Product, Table, Category } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-manager-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <p class="text-sm text-gray-500 mt-1">Criar e gerenciar pedidos como garçom</p>
        </div>
        <button
          (click)="openOrderForm()"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          + Novo Pedido
        </button>
      </div>

      <!-- Orders Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          *ngFor="let order of orders"
          class="card group hover:shadow-lg transition-all"
          [class.opacity-50]="order.status === 'closed'"
        >
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">🪑 {{ order.table_number }}</h3>
              <p class="text-sm text-gray-600">{{ order.customer_name }}</p>
            </div>
            <span
              class="badge"
              [ngClass]="{
                'badge-success': order.status === 'closed',
                'badge-warning': order.status === 'open',
                'badge-info': order.status === 'sent',
                'badge-primary': order.status === 'completed'
              }"
            >
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <!-- Items -->
          <div class="space-y-2 mb-4 pb-4 border-b border-gray-200">
            <div *ngFor="let item of order.items" class="flex justify-between text-sm">
              <span class="text-gray-600">{{ item.quantity }}x {{ item.product_name }}</span>
              <span class="font-medium">R$ {{ (item.unit_price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center mb-4">
            <span class="text-gray-600 font-medium">Total:</span>
            <span class="text-xl font-bold text-primary-600">R$ {{ order.total_price.toFixed(2) }}</span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              *ngIf="order.status === 'open'"
              (click)="editOrder(order)"
              class="flex-1 btn btn-sm btn-primary"
            >
              ✏️ Editar
            </button>
            <button
              *ngIf="order.status === 'open'"
              (click)="sendOrder(order.id)"
              class="flex-1 btn btn-sm btn-success"
            >
              📤 Enviar
            </button>
            <button
              *ngIf="order.status === 'sent' || order.status === 'completed'"
              (click)="closeOrder(order.id)"
              class="flex-1 btn btn-sm btn-success"
            >
              ✔️ Fechar
            </button>
            <button
              (click)="deleteOrder(order.id)"
              class="flex-1 btn btn-sm btn-danger"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="orders.length === 0" class="card text-center py-12">
        <p class="text-gray-500 text-lg">📭 Nenhum pedido criado</p>
      </div>

      <!-- Order Form Modal -->
      <div *ngIf="showOrderForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-xl font-bold text-gray-900">
              {{ editingOrderId ? 'Editar Pedido' : 'Novo Pedido' }}
            </h3>
          </div>

          <div class="p-6 space-y-6">
            <!-- Table Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Mesa</label>
              <select
                [(ngModel)]="selectedTableId"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione uma mesa</option>
                <option *ngFor="let table of availableTables" [value]="table.id">
                  Mesa {{ table.number }}
                </option>
              </select>
            </div>

            <!-- Customer Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente</label>
              <input
                type="text"
                [(ngModel)]="customerName"
                placeholder="Ex: João Silva"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <!-- Products Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Adicionar Produtos</label>
              <div class="space-y-2 mb-4">
                <div *ngFor="let category of categories" class="border-t pt-3">
                  <p class="text-sm font-semibold text-gray-700 mb-2">{{ category.icon }} {{ category.name }}</p>
                  <div class="grid grid-cols-2 gap-2">
                    <button
                      *ngFor="let product of getProductsByCategory(category.id)"
                      type="button"
                      (click)="addProductToOrder(product)"
                      class="p-2 text-left border border-gray-200 rounded hover:bg-primary-50 transition-colors text-sm"
                    >
                      <p class="font-medium">{{ product.name }}</p>
                      <p class="text-xs text-gray-500">R$ {{ product.price.toFixed(2) }}</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div *ngIf="orderItems.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">Itens do Pedido</label>
              <div class="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div *ngFor="let item of orderItems; let i = index" class="flex items-center justify-between bg-white p-3 rounded">
                  <div class="flex-1">
                    <p class="text-sm font-medium">{{ item.product_name }}</p>
                    <p class="text-xs text-gray-500">R$ {{ item.unit_price.toFixed(2) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      (click)="decreaseQuantity(i)"
                      class="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      −
                    </button>
                    <span class="w-8 text-center">{{ item.quantity }}</span>
                    <button
                      type="button"
                      (click)="increaseQuantity(i)"
                      class="px-2 py-1 bg-gray-200 rounded text-sm"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      (click)="removeItem(i)"
                      class="px-2 py-1 bg-red-200 text-red-600 rounded text-sm"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-primary-50 p-4 rounded-lg">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total:</span>
                <span class="text-2xl font-bold text-primary-600">R$ {{ calculateTotal().toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              (click)="closeOrderForm()"
              class="flex-1 btn btn-outline"
            >
              Cancelar
            </button>
            <button
              (click)="saveOrder()"
              [disabled]="!selectedTableId || !customerName || orderItems.length === 0"
              class="flex-1 btn btn-primary"
              [class.opacity-50]="!selectedTableId || !customerName || orderItems.length === 0"
            >
              {{ editingOrderId ? 'Atualizar' : 'Criar' }} Pedido
            </button>
          </div>
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
export class ManagerOrdersComponent implements OnInit {
  orders: Order[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  availableTables: Table[] = [];

  showOrderForm = false;
  editingOrderId: string | null = null;
  selectedTableId = '';
  customerName = '';
  orderItems: OrderItem[] = [];

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
    this.loadTables();
  }

  loadOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
    });
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadTables(): void {
    this.dataService.getTables().subscribe((tables) => {
      this.availableTables = tables.filter((t) => t.status === 'available');
    });
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter((p) => p.category_id === categoryId && p.active);
  }

  openOrderForm(): void {
    this.showOrderForm = true;
    this.editingOrderId = null;
    this.resetForm();
  }

  closeOrderForm(): void {
    this.showOrderForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedTableId = '';
    this.customerName = '';
    this.orderItems = [];
  }

  addProductToOrder(product: Product): void {
    const existingItem = this.orderItems.find((i) => i.product_id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderItems.push({
        id: Date.now().toString(),
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        status: 'pending',
      });
    }
  }

  removeItem(index: number): void {
    this.orderItems.splice(index, 1);
  }

  increaseQuantity(index: number): void {
    this.orderItems[index].quantity++;
  }

  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
    }
  }

  calculateTotal(): number {
    return this.orderItems.reduce((total, item) => total + item.unit_price * item.quantity, 0);
  }

  saveOrder(): void {
    if (!this.selectedTableId || !this.customerName || this.orderItems.length === 0) {
      this.notificationService.error('Preencha todos os campos');
      return;
    }

    const selectedTable = this.availableTables.find((t) => t.id === this.selectedTableId);
    if (!selectedTable) {
      this.notificationService.error('Mesa inválida');
      return;
    }

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customer_name: this.customerName,
      table_number: `Mesa ${selectedTable.number}`,
      status: 'open',
      items: this.orderItems,
      created_at: new Date(),
      updated_at: new Date(),
      total_price: this.calculateTotal(),
      waiter_id: 'manager',
    };

    this.dataService.createOrder(newOrder);
    this.dataService.updateTable(this.selectedTableId, { status: 'occupied' });
    this.notificationService.success('Pedido criado com sucesso!');
    this.closeOrderForm();
  }

  editOrder(order: Order): void {
    this.editingOrderId = order.id;
    this.selectedTableId = this.availableTables.find((t) => t.number === order.table_number.replace('Mesa ', ''))?.id || '';
    this.customerName = order.customer_name;
    this.orderItems = [...order.items];
    this.showOrderForm = true;
  }

  sendOrder(orderId: string): void {
    this.dataService.updateOrder(orderId, { status: 'sent' });
    this.notificationService.success('Pedido enviado para cozinha!');
  }

  closeOrder(orderId: string): void {
    this.dataService.updateOrder(orderId, { status: 'closed' });
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      const table = this.availableTables.find((t) => t.number === order.table_number.replace('Mesa ', ''));
      if (table) {
        this.dataService.updateTable(table.id, { status: 'available' });
      }
    }
    this.notificationService.success('Pedido fechado!');
  }

  deleteOrder(orderId: string): void {
    if (confirm('Tem certeza que deseja deletar este pedido?')) {
      this.dataService.deleteOrder(orderId);
      this.notificationService.success('Pedido deletado!');
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      open: '🔓 Aberta',
      sent: '📤 Enviada',
      completed: '✅ Pronta',
      closed: '✔️ Fechada',
    };
    return labels[status] || status;
  }
}

