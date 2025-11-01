import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private notificationId = 0;

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  success(message: string, duration = 3000): void {
    this.show({
      type: 'success',
      message,
      duration,
    });
  }

  error(message: string, duration = 5000): void {
    this.show({
      type: 'error',
      message,
      duration,
    });
  }

  warning(message: string, duration = 4000): void {
    this.show({
      type: 'warning',
      message,
      duration,
    });
  }

  info(message: string, duration = 3000): void {
    this.show({
      type: 'info',
      message,
      duration,
    });
  }

  private show(notification: Omit<Notification, 'id'>): void {
    const id = `notification-${this.notificationId++}`;
    const fullNotification: Notification = {
      ...notification,
      id,
    };

    const current = this.notifications$.value;
    this.notifications$.next([...current, fullNotification]);

    if (notification.duration) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }
  }

  remove(id: string): void {
    const current = this.notifications$.value;
    this.notifications$.next(current.filter((n) => n.id !== id));
  }

  clear(): void {
    this.notifications$.next([]);
  }
}

