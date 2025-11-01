import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-notification-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
})
export class NotificationContainerComponent implements OnInit, AfterViewInit {
  notifications: Notification[] = [];
  @ViewChildren('notificationItem') notificationItems!: QueryList<ElementRef>;

  constructor(
    private notificationService: NotificationService,
    private animationService: AnimationService
  ) {}

  ngOnInit(): void {
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  ngAfterViewInit(): void {
    this.notificationItems.changes.subscribe(() => {
      this.animateNewNotifications();
    });
  }

  private animateNewNotifications(): void {
    const items = this.notificationItems.toArray();
    if (items.length > 0) {
      const lastItem = items[items.length - 1].nativeElement;
      this.animationService.slideDown(lastItem, 0.4);
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  }

  getColor(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  close(id: string): void {
    this.notificationService.remove(id);
  }
}

