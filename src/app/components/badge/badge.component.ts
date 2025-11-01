import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class.badge-primary]="variant === 'primary'"
          [class.badge-secondary]="variant === 'secondary'"
          [class.badge-success]="variant === 'success'"
          [class.badge-danger]="variant === 'danger'"
          [class.badge-warning]="variant === 'warning'"
          [class.badge-info]="variant === 'info'"
          [class.animate-pulse]="pulse"
          class="badge inline-flex items-center gap-2">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() pulse = false;
}

