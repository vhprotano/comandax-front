import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationState;
}

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private paginationState$ = new BehaviorSubject<PaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  getPaginationState(): Observable<PaginationState> {
    return this.paginationState$.asObservable();
  }

  getCurrentPage(): number {
    return this.paginationState$.value.currentPage;
  }

  getPageSize(): number {
    return this.paginationState$.value.pageSize;
  }

  setPageSize(pageSize: number): void {
    const state = this.paginationState$.value;
    this.paginationState$.next({
      ...state,
      pageSize,
      currentPage: 1,
    });
  }

  goToPage(page: number): void {
    const state = this.paginationState$.value;
    const validPage = Math.max(1, Math.min(page, state.totalPages));
    this.paginationState$.next({
      ...state,
      currentPage: validPage,
    });
  }

  nextPage(): void {
    const state = this.paginationState$.value;
    if (state.currentPage < state.totalPages) {
      this.goToPage(state.currentPage + 1);
    }
  }

  previousPage(): void {
    const state = this.paginationState$.value;
    if (state.currentPage > 1) {
      this.goToPage(state.currentPage - 1);
    }
  }

  paginate<T>(items: T[], pageSize: number = 10): PaginatedResult<T> {
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = Math.max(1, Math.min(this.getCurrentPage(), totalPages));

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);

    const state: PaginationState = {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    };

    this.paginationState$.next(state);

    return {
      items: paginatedItems,
      pagination: state,
    };
  }

  paginateObservable<T>(
    items$: Observable<T[]>,
    pageSize: number = 10
  ): Observable<PaginatedResult<T>> {
    return items$.pipe(
      map((items) => this.paginate(items, pageSize))
    );
  }

  reset(): void {
    this.paginationState$.next({
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
    });
  }

  // Lazy loading - carregar itens sob demanda
  lazyLoad<T>(
    items: T[],
    pageSize: number = 20
  ): Observable<T[]> {
    return new Observable((observer) => {
      let currentIndex = 0;

      const loadMore = () => {
        const endIndex = Math.min(currentIndex + pageSize, items.length);
        const batch = items.slice(currentIndex, endIndex);

        observer.next(batch);

        if (endIndex < items.length) {
          currentIndex = endIndex;
          setTimeout(loadMore, 300); // Simular delay de carregamento
        } else {
          observer.complete();
        }
      };

      loadMore();
    });
  }

  // Infinite scroll
  infiniteScroll<T>(
    items: T[],
    pageSize: number = 20
  ): Observable<T[]> {
    return new Observable((observer) => {
      let loadedItems: T[] = [];
      let currentIndex = 0;

      const loadMore = () => {
        const endIndex = Math.min(currentIndex + pageSize, items.length);
        loadedItems = [...loadedItems, ...items.slice(currentIndex, endIndex)];

        observer.next(loadedItems);

        if (endIndex < items.length) {
          currentIndex = endIndex;
        }
      };

      loadMore();

      return () => {
        // Cleanup
      };
    });
  }
}

