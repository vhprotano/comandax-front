import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeService, RealtimeNotification } from '../../services/realtime.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-kitchen-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      <div
        *ngFor="let notification of notifications"
        [class]="'notification-item ' + notification.type"
        class="bg-white rounded-lg shadow-lg border-l-4 p-4 animate-slideIn"
        [ngClass]="{
          'border-l-blue-500': notification.type === 'order_received',
          'border-l-green-500': notification.type === 'order_ready',
          'border-l-purple-500': notification.type === 'order_completed',
          'border-l-yellow-500': notification.type === 'new_employee',
          'border-l-gray-500': notification.type === 'system'
        }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ notification.title }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ notification.message }}</p>
            <p class="text-xs text-gray-400 mt-2">
              {{ notification.timestamp | date: 'HH:mm:ss' }}
            </p>
          </div>
          <button
            (click)="deleteNotification(notification.id)"
            class="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slideIn {
      animation: slideIn 0.3s ease-out;
    }

    .notification-item {
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }
    }
  `],
})
export class KitchenNotificationsComponent implements OnInit, OnDestroy {
  notifications: RealtimeNotification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private realtimeService: RealtimeService) {}

  ngOnInit(): void {
    this.realtimeService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications.slice(0, 5); // Mostrar apenas as 5 últimas
      });
  }

  deleteNotification(id: string): void {
    this.realtimeService.deleteNotification(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

