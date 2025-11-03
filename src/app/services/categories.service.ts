import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Category } from '../models';

// ==================== GRAPHQL QUERIES ====================

const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories {
      id
      name
      icon
    }
  }
`;

const CREATE_PRODUCT_CATEGORY = gql`
  mutation CreateProductCategory($name: String!, $icon: String) {
    createProductCategory(name: $name, icon: $icon) {
      id
      name
      icon
    }
  }
`;

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categories$ = new BehaviorSubject<Category[]>([]);

  constructor(private apollo: Apollo) {
    this.loadCategories();
  }

  

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  createCategory(name: string, icon?: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRODUCT_CATEGORY,
        variables: { name, icon },
      })
      .pipe(
        map((result: any) => result.data?.createProductCategory),
        tap((newCategory) => {
          const category: Category = {
            id: newCategory.id,
            name: newCategory.name,
            icon: newCategory.icon || '📦',
          };
          const current = this.categories$.value;
          this.categories$.next([...current, category]);
        })
      );
  }

  addCategory(category: Category): void {
    const current = this.categories$.value;
    this.categories$.next([...current, category]);
  }

  updateCategory(id: string, category: Partial<Category>): void {
    const current = this.categories$.value;
    const updated = current?.map((c) => (c.id === id ? { ...c, ...category } : c));
    this.categories$.next(updated);
  }

  deleteCategory(id: string): void {
    const current = this.categories$.value;
    this.categories$.next(current.filter((c) => c.id !== id));
  }

  

  private loadCategories(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_PRODUCT_CATEGORIES,
      })
      .valueChanges.pipe(
        map((result) => result.data?.productCategories)
      )
      .subscribe({
        next: (categories) => {
          const mappedCategories: Category[] = categories?.map((c: any) => ({
            id: c.id,
            name: c.name,
            icon: c.icon || '📦',
          }));
          this.categories$.next(mappedCategories);
        },
        error: (err) => console.error('Error loading categories:', err),
      });
  }
}

