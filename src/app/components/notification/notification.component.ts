import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #notificationElement 
         [class.bg-secondary-50]="type === 'success'"
         [class.border-secondary-200]="type === 'success'"
         [class.bg-red-50]="type === 'error'"
         [class.border-red-200]="type === 'error'"
         [class.bg-yellow-50]="type === 'warning'"
         [class.border-yellow-200]="type === 'warning'"
         [class.bg-blue-50]="type === 'info'"
         [class.border-blue-200]="type === 'info'"
         class="fixed top-4 right-4 max-w-md p-4 rounded-lg border shadow-lg flex items-start gap-3 z-50">
      
      <!-- Icon -->
      <div class="text-2xl flex-shrink-0">
        {{ getIcon() }}
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h3 [class.text-secondary-900]="type === 'success'"
            [class.text-red-900]="type === 'error'"
            [class.text-yellow-900]="type === 'warning'"
            [class.text-blue-900]="type === 'info'"
            class="font-semibold text-sm">
          {{ title }}
        </h3>
        <p [class.text-secondary-700]="type === 'success'"
           [class.text-red-700]="type === 'error'"
           [class.text-yellow-700]="type === 'warning'"
           [class.text-blue-700]="type === 'info'"
           class="text-xs mt-1">
          {{ message }}
        </p>
      </div>

      <!-- Close Button -->
      <button (click)="close()"
              class="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
        ✕
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NotificationComponent implements OnInit, AfterViewInit {
  @Input() type: NotificationType = 'info';
  @Input() title = 'Notificação';
  @Input() message = '';
  @Input() duration = 5000;
  @ViewChild('notificationElement') notificationElement!: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) {}

  ngOnInit(): void {
    if (this.duration > 0) {
      setTimeout(() => this.close(), this.duration);
    }
  }

  ngAfterViewInit(): void {
    if (this.notificationElement) {
      this.animationService.slideDown(this.notificationElement.nativeElement, 0.3);
    }
  }

  getIcon(): string {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[this.type];
  }

  close(): void {
    if (this.notificationElement) {
      this.animationService.slideUp(this.notificationElement.nativeElement, 0.3).then(() => {
        this.notificationElement.nativeElement.remove();
      });
    }
  }
}

