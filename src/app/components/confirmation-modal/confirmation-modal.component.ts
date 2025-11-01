import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, ConfirmationDialog } from '../../services/confirmation.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="dialogs.length > 0" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        (click)="closeAll()"
      ></div>

      <!-- Modal -->
      <div
        *ngFor="let dialog of dialogs"
        class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-slideUp"
        [ngClass]="'border-l-4 border-' + getColorClass(dialog.type)"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">{{ dialog.title }}</h2>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl">{{ getIcon(dialog.type) }}</span>
            <p class="text-gray-600">{{ dialog.message }}</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            (click)="dialog.onCancel?.()"
            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors font-medium"
          >
            {{ dialog.cancelText }}
          </button>
          <button
            (click)="dialog.onConfirm?.()"
            [ngClass]="'bg-' + getColorClass(dialog.type) + ' hover:' + getColorClassHover(dialog.type)"
            class="px-4 py-2 text-white rounded-lg transition-colors font-medium"
          >
            {{ dialog.confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slideUp {
      animation: slideUp 0.3s ease-out;
    }
  `],
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  dialogs: ConfirmationDialog[] = [];
  private destroy$ = new Subject<void>();

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.confirmationService
      .getDialogs()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dialogs) => {
        this.dialogs = dialogs;
      });
  }

  getIcon(type?: string): string {
    switch (type) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚡';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  getColorClass(type?: string): string {
    switch (type) {
      case 'danger':
        return 'red-500';
      case 'warning':
        return 'yellow-500';
      case 'success':
        return 'green-500';
      case 'info':
      default:
        return 'blue-500';
    }
  }

  getColorClassHover(type?: string): string {
    switch (type) {
      case 'danger':
        return 'bg-red-700';
      case 'warning':
        return 'bg-yellow-600';
      case 'success':
        return 'bg-green-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  }

  closeAll(): void {
    this.confirmationService.closeAll();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

