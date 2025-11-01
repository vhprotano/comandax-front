import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationService, PaginationState } from '../../services/pagination.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex items-center justify-between gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
      <!-- Info -->
      <div class="text-sm text-gray-600">
        Mostrando
        <span class="font-medium">{{ startItem }}</span>
        a
        <span class="font-medium">{{ endItem }}</span>
        de
        <span class="font-medium">{{ pagination.totalItems }}</span>
        itens
      </div>

      <!-- Page Size -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600">Itens por página:</label>
        <select
          [(ngModel)]="pageSize"
          (ngModelChange)="onPageSizeChange()"
          class="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option [value]="5">5</option>
          <option [value]="10">10</option>
          <option [value]="20">20</option>
          <option [value]="50">50</option>
          <option [value]="100">100</option>
        </select>
      </div>

      <!-- Navigation -->
      <div class="flex items-center gap-2">
        <button
          (click)="previousPage()"
          [disabled]="pagination.currentPage === 1"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>

        <div class="flex items-center gap-1">
          <button
            *ngFor="let page of getPageNumbers()"
            (click)="goToPage(page)"
            [class.bg-primary-600]="page === pagination.currentPage"
            [class.text-white]="page === pagination.currentPage"
            [class.bg-gray-100]="page !== pagination.currentPage"
            class="px-3 py-1 rounded-lg transition-colors"
          >
            {{ page }}
          </button>
        </div>

        <button
          (click)="nextPage()"
          [disabled]="pagination.currentPage === pagination.totalPages"
          class="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Próximo →
        </button>
      </div>

      <!-- Page Info -->
      <div class="text-sm text-gray-600">
        Página
        <span class="font-medium">{{ pagination.currentPage }}</span>
        de
        <span class="font-medium">{{ pagination.totalPages }}</span>
      </div>
    </div>
  `,
  styles: [],
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() pagination: PaginationState = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };
  @Output() pageChanged = new EventEmitter<number>();
  @Output() pageSizeChanged = new EventEmitter<number>();

  pageSize: number = 10;
  private destroy$ = new Subject<void>();

  constructor(private paginationService: PaginationService) {}

  ngOnInit(): void {
    this.pageSize = this.pagination.pageSize;
  }

  get startItem(): number {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(
      this.pagination.currentPage * this.pagination.pageSize,
      this.pagination.totalItems
    );
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPages = 5;
    const halfPages = Math.floor(maxPages / 2);

    let startPage = Math.max(1, this.pagination.currentPage - halfPages);
    let endPage = Math.min(
      this.pagination.totalPages,
      startPage + maxPages - 1
    );

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    this.paginationService.goToPage(page);
    this.pageChanged.emit(page);
  }

  nextPage(): void {
    if (this.pagination.currentPage < this.pagination.totalPages) {
      this.goToPage(this.pagination.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.pagination.currentPage > 1) {
      this.goToPage(this.pagination.currentPage - 1);
    }
  }

  onPageSizeChange(): void {
    this.paginationService.setPageSize(this.pageSize);
    this.pageSizeChanged.emit(this.pageSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

