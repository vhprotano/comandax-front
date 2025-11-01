import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8">
      <!-- Spinner -->
      <div class="relative w-16 h-16 mb-4">
        <div class="absolute inset-0 rounded-full border-4 border-gray-200"></div>
        <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 border-r-primary-600 animate-spin"></div>
      </div>

      <!-- Text -->
      <p class="text-gray-600 font-medium">{{ message }}</p>
      
      <!-- Dots Animation -->
      <div class="flex gap-1 mt-2">
        <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0s"></span>
        <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
        <span class="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class LoadingComponent {
  @Input() message = 'Carregando...';
}

