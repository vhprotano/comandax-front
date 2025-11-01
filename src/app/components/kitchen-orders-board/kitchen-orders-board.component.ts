import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeService } from '../../services/realtime.service';
import { DataService, Order } from '../../services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kitchen-orders-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        *ngFor="let order of pendingOrders"
        class="bg-white rounded-lg shadow-md border-2 border-yellow-400 p-4 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div>
            <h3 class="text-lg font-bold text-gray-900">{{ order.table_number }}</h3>
            <p class="text-sm text-gray-600">{{ order.customer_name }}</p>
          </div>
          <span class="text-2xl">🔔</span>
        </div>

        <div class="space-y-2 mb-4">
          <div
            *ngFor="let item of order.items"
            class="bg-gray-50 p-2 rounded border-l-4 border-blue-500"
          >
            <p class="font-medium text-gray-900">{{ item.quantity }}x {{ item.product_name }}</p>
            <p class="text-xs text-gray-600">R$ {{ (item.unit_price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            (click)="markAsReady(order.id)"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition-colors"
          >
            ✓ Pronto
          </button>
          <button
            (click)="markAsInProgress(order.id)"
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors"
          >
            ⏱ Preparando
          </button>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          {{ order.created_at | date: 'HH:mm:ss' }}
        </p>
      </div>

      <div *ngIf="pendingOrders.length === 0" class="col-span-full text-center py-12">
        <p class="text-2xl mb-2">😊</p>
        <p class="text-gray-600">Nenhum pedido pendente no momento</p>
      </div>
    </div>
  `,
  styles: [],
})
export class KitchenOrdersBoardComponent implements OnInit, OnDestroy {
  pendingOrders: Order[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private realtimeService: RealtimeService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // Carregar pedidos iniciais
    this.dataService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders) => {
        this.pendingOrders = orders.filter((o) => o.status === 'sent');
        this.realtimeService.updateKitchenOrders(this.pendingOrders);
      });

    // Escutar atualizações em tempo real
    this.realtimeService
      .getKitchenOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders) => {
        this.pendingOrders = orders;
      });
  }

  markAsReady(orderId: string): void {
    this.dataService.updateOrder(orderId, { status: 'completed' });
    this.realtimeService.simulateOrderReady(orderId);
    this.updatePendingOrders();
  }

  markAsInProgress(orderId: string): void {
    // Simular que o pedido está sendo preparado
    this.realtimeService.simulateOrderStatusUpdate(orderId, 'in_progress');
  }

  private updatePendingOrders(): void {
    this.dataService.getOrders().subscribe((orders) => {
      this.pendingOrders = orders.filter((o) => o.status === 'sent');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

