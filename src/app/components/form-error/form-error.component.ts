import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="control && control.invalid && (control.dirty || control.touched)"
      class="mt-1 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm flex items-start gap-2"
    >
      <span class="text-red-500 font-bold">⚠</span>
      <span>{{ errorMessage }}</span>
    </div>
  `,
  styles: [],
})
export class FormErrorComponent {
  @Input() control: AbstractControl | null = null;
  @Input() fieldName: string = 'Campo';

  constructor(private validationService: ValidationService) {}

  get errorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    return this.validationService.getErrorMessage(this.control.errors, this.fieldName);
  }
}

