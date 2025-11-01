import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RealtimeNotification {
  id: string;
  type: 'order_received' | 'order_ready' | 'order_completed' | 'new_employee' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private notifications$ = new BehaviorSubject<RealtimeNotification[]>([]);
  private orderUpdates$ = new BehaviorSubject<any>(null);
  private kitchenOrders$ = new BehaviorSubject<any[]>([]);

  constructor() {
    this.initializeMockRealtime();
  }

  private initializeMockRealtime(): void {
    // Simular notificações em tempo real a cada 5-10 segundos
    interval(5000 + Math.random() * 5000).subscribe(() => {
      this.generateMockNotification();
    });

    // Simular atualizações de pedidos da cozinha a cada 3-8 segundos
    interval(3000 + Math.random() * 5000).subscribe(() => {
      this.simulateKitchenUpdate();
    });
  }

  private generateMockNotification(): void {
    const notifications = this.notifications$.value;
    const types: RealtimeNotification['type'][] = [
      'order_received',
      'order_ready',
      'order_completed',
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const messages = {
      order_received: {
        title: '📋 Novo Pedido Recebido',
        message: `Pedido #${Math.floor(Math.random() * 1000)} foi enviado para a cozinha`,
      },
      order_ready: {
        title: '✅ Pedido Pronto',
        message: `Pedido #${Math.floor(Math.random() * 1000)} está pronto para servir`,
      },
      order_completed: {
        title: '🎉 Pedido Completado',
        message: `Pedido #${Math.floor(Math.random() * 1000)} foi finalizado`,
      },
      new_employee: {
        title: '👤 Novo Funcionário',
        message: 'Um novo funcionário foi adicionado ao sistema',
      },
      system: {
        title: '⚙️ Notificação do Sistema',
        message: 'Atualização do sistema realizada com sucesso',
      },
    };

    const messageData = messages[randomType];

    const newNotification: RealtimeNotification = {
      id: `notif-${Date.now()}`,
      type: randomType,
      title: messageData.title,
      message: messageData.message,
      timestamp: new Date(),
      read: false,
    };

    // Manter apenas as últimas 20 notificações
    const updatedNotifications = [newNotification, ...notifications].slice(0, 20);
    this.notifications$.next(updatedNotifications);
  }

  private simulateKitchenUpdate(): void {
    const orders = this.kitchenOrders$.value;
    if (orders.length > 0) {
      const randomIndex = Math.floor(Math.random() * orders.length);
      const updatedOrders = [...orders];
      updatedOrders[randomIndex] = {
        ...updatedOrders[randomIndex],
        status: updatedOrders[randomIndex].status === 'pending' ? 'ready' : 'pending',
        updated_at: new Date(),
      };
      this.kitchenOrders$.next(updatedOrders);
    }
  }

  getNotifications(): Observable<RealtimeNotification[]> {
    return this.notifications$.asObservable();
  }

  getUnreadNotificationsCount(): Observable<number> {
    return this.notifications$.pipe(
      map((notifs) => notifs.filter((n) => !n.read).length)
    );
  }

  markNotificationAsRead(id: string): void {
    const notifications = this.notifications$.value;
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications$.next(updated);
  }

  markAllAsRead(): void {
    const notifications = this.notifications$.value;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    this.notifications$.next(updated);
  }

  clearNotifications(): void {
    this.notifications$.next([]);
  }

  deleteNotification(id: string): void {
    const notifications = this.notifications$.value;
    this.notifications$.next(notifications.filter((n) => n.id !== id));
  }

  // Simular recebimento de novo pedido
  simulateNewOrder(order: any): void {
    const notification: RealtimeNotification = {
      id: `notif-${Date.now()}`,
      type: 'order_received',
      title: '📋 Novo Pedido Recebido',
      message: `Pedido #${order.id} da mesa ${order.table_number} foi enviado para a cozinha`,
      timestamp: new Date(),
      read: false,
      data: order,
    };

    const notifications = this.notifications$.value;
    this.notifications$.next([notification, ...notifications].slice(0, 20));
  }

  // Simular pedido pronto
  simulateOrderReady(orderId: string): void {
    const notification: RealtimeNotification = {
      id: `notif-${Date.now()}`,
      type: 'order_ready',
      title: '✅ Pedido Pronto',
      message: `Pedido #${orderId} está pronto para servir`,
      timestamp: new Date(),
      read: false,
      data: { orderId },
    };

    const notifications = this.notifications$.value;
    this.notifications$.next([notification, ...notifications].slice(0, 20));
  }

  // Atualizar pedidos da cozinha
  updateKitchenOrders(orders: any[]): void {
    this.kitchenOrders$.next(orders);
  }

  getKitchenOrders(): Observable<any[]> {
    return this.kitchenOrders$.asObservable();
  }

  // Simular atualização de status de pedido
  simulateOrderStatusUpdate(orderId: string, newStatus: string): void {
    this.orderUpdates$.next({
      orderId,
      newStatus,
      timestamp: new Date(),
    });
  }

  getOrderUpdates(): Observable<any> {
    return this.orderUpdates$.asObservable();
  }
}

