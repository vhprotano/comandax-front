import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { NotificationService } from '../../../services/notification.service';
import { RealtimeService } from '../../../services/realtime.service';
import { ReceiptComponent } from '../../../components/receipt/receipt.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-waiter-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ReceiptComponent, LucideAngularModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class WaiterDashboardComponent implements OnInit, OnDestroy {
  activeTab = 'orders';
  userName = 'Garçom';
  orders: Order[] = [];
  closedOrders: Order[] = [];
  selectedOrderForReceipt: Order | null = null;
  private destroy$ = new Subject<void>();

  readonly Plus = Plus;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ordersService: OrdersService,
    private notificationService: NotificationService,
    private realtimeService: RealtimeService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
    this.loadOrders();
    this.listenForOrderUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private listenForOrderUpdates(): void {
    this.realtimeService.getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        // Procurar por notificações de pedido pronto
        const readyNotifications = notifications.filter((n) => n.type === 'order_ready');
        if (readyNotifications.length > 0) {
          const latestReady = readyNotifications[0];
          // Atualizar pedidos para refletir o status pronto
          this.loadOrders();
          this.notificationService.success(latestReady.message);
        }
      });
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      // Separar pedidos abertos e fechados
      this.orders = orders.filter((o) => o.status !== 'closed');
      this.closedOrders = orders.filter((o) => o.status === 'closed');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  createNewOrder(): void {
    this.router.navigate(['/waiter/new']);
  }

  editOrder(id: string): void {
    this.router.navigate(['/waiter/edit', id]);
  }

  deleteOrder(id: string): void {
    if (confirm('Tem certeza que deseja deletar esta comanda?')) {
      this.dataService.deleteOrder(id);
      this.notificationService.success('Comanda deletada com sucesso!');
    }
  }

  sendToKitchen(id: string): void {
    this.dataService.updateOrder(id, { status: 'sent' });
    this.notificationService.success('Comanda enviada para a cozinha!');
  }

  markAsDelivered(id: string): void {
    this.dataService.updateOrder(id, { status: 'completed' });
    this.notificationService.success('Pedido marcado como entregue!');
  }

  closeOrder(id: string): void {
    const order = this.orders.find((o) => o.id === id);
    if (order) {
      // Mostrar recibo para seleção de método de pagamento
      this.selectedOrderForReceipt = order;

      // Update table status if it was from a table
      const tableNumber = order.table_number.replace('Mesa ', '');
      this.dataService.getTables().subscribe((tables) => {
        const table = tables.find((t) => t.number === tableNumber);
        if (table) {
          this.dataService.updateTable(table.id, { status: 'FREE' });
        }
      });
    }
  }

  finalizeOrder(id: string): void {
    this.dataService.updateOrder(id, { status: 'closed' });
    this.notificationService.success('Comanda fechada!');
    this.closeReceipt();
    this.loadOrders();
  }

  showReceipt(order: Order): void {
    this.selectedOrderForReceipt = order;
  }

  closeReceipt(): void {
    this.selectedOrderForReceipt = null;
  }

  printReceipt(): void {
    // Implementar lógica de impressão
    this.notificationService.success('Recibo enviado para impressão!');
  }
}

