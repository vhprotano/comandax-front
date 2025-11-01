import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../services/animation.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" 
         #backdropElement
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         (click)="onBackdropClick()">
      
      <div #modalElement
           class="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">{{ title }}</h2>
          <button (click)="close()"
                  class="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none">
            ✕
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div class="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button (click)="close()"
                  class="btn btn-outline flex-1">
            Cancelar
          </button>
          <button (click)="confirm()"
                  class="btn btn-primary flex-1">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ModalComponent implements AfterViewInit {
  @Input() isOpen = false;
  @Input() title = 'Modal';
  @Input() confirmText = 'Confirmar';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();
  @ViewChild('backdropElement') backdropElement!: ElementRef<HTMLElement>;
  @ViewChild('modalElement') modalElement!: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) {}

  ngAfterViewInit(): void {
    if (this.isOpen && this.modalElement) {
      this.animationService.scaleIn(this.modalElement.nativeElement, 0.3);
    }
  }

  confirm(): void {
    this.onConfirm.emit();
    this.close();
  }

  close(): void {
    if (this.modalElement) {
      this.animationService.fadeOut(this.modalElement.nativeElement, 0.2).then(() => {
        this.onClose.emit();
      });
    }
  }

  onBackdropClick(): void {
    this.close();
  }
}

