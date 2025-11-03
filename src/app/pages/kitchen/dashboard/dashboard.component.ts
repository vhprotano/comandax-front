import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from '../../../models';
import { AuthService } from '../../../services/auth.service';
import { OrdersService } from '../../../services/orders.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-kitchen-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class KitchenDashboardComponent implements OnInit {
  userName = 'Cozinha';
  pendingOrders: Order[] = [];
  completedOrders: Order[] = [];
  historyOrders: Order[] = [];
  activeTab = 'kanban';

  constructor(
    private authService: AuthService,
    private router: Router,
    private ordersService: OrdersService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.pendingOrders = orders.filter((o) => o.status === 'sent');
      this.completedOrders = orders.filter((o) => o.status === 'completed');
      this.historyOrders = orders.filter((o) => o.status === 'closed');
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  markAsReady(id: string): void {
    this.ordersService.updateOrder(id, { status: 'completed' });
    this.notificationService.success('Pedido marcado como pronto!');
    this.playNotificationSound();
    this.loadOrders();
  }

  removeFromReady(id: string): void {
    // Remover pedido da lista de prontos (quando garçom marca como entregue)
    this.completedOrders = this.completedOrders.filter((o) => o.id !== id);
    this.notificationService.success('Pedido removido da lista de prontos!');
  }

  playNotificationSound(): void {
    // Implementar som de notificação
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play().catch(() => {
      console.log('Notificação: Pedido pronto!');
    });
  }
}

