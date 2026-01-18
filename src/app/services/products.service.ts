import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Product } from "../models";

// ==================== GRAPHQL QUERIES ====================

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      code
      needPreparation
      isPricePerKg
      productCategoryId
      productCategory {
        id
        name
        icon
      }
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $price: Decimal!
    $productCategoryId: UUID
    $isPricePerKg: Boolean
  ) {
    createProduct(
      name: $name
      price: $price
      productCategoryId: $productCategoryId
      isPricePerKg: $isPricePerKg
    ) {
      id
      name
      price
      productCategoryId
      isPricePerKg
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: UUID!
    $name: String
    $price: Decimal
    $needPreparation: Boolean
    $productCategoryId: UUID
    $isPricePerKg: Boolean
  ) {
    updateProduct(
      id: $id
      name: $name
      price: $price
      needPreparation: $needPreparation
      productCategoryId: $productCategoryId
      isPricePerKg: $isPricePerKg
    )
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: UUID!) {
    deleteProduct(id: $id)
  }
`;

// ==================== SERVICE ====================

@Injectable({
  providedIn: "root",
})
export class ProductsService {
  private products$ = new BehaviorSubject<Product[]>([]);

  constructor(private apollo: Apollo) {
    this.loadProducts();
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  createProduct(
    name: string,
    price: number,
    productCategoryId?: string | null,
    isPricePerKg?: boolean
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRODUCT,
        variables: {
          name,
          price,
          productCategoryId: productCategoryId || null,
          isPricePerKg: isPricePerKg || false,
        },
      })
      .pipe(
        map((result: any) => result.data?.createProduct),
        tap((newProduct) => {
          const product: Product = {
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price,
            category_id: newProduct.productCategoryId,
            isPricePerKg: isPricePerKg || false,
            active: true,
          };
          const current = this.products$.value;
          this.products$.next([...current, product]);
        })
      );
  }

  updateProduct(
    id: string,
    updates: {
      name?: string;
      price?: number;
      needPreparation?: boolean;
      productCategoryId?: string | null;
      isPricePerKg?: boolean;
    }
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: UPDATE_PRODUCT,
        variables: {
          id,
          name: updates.name,
          price: updates.price,
          needPreparation: updates.needPreparation,
          productCategoryId: updates.productCategoryId || null,
          isPricePerKg: updates.isPricePerKg || false,
        },
      })
      .pipe(
        map((result: any) => result.data?.updateProduct),
        tap((success) => {
          if (success) {
            const current = this.products$.value;
            const updated = current?.map((p) =>
              p.id === id
                ? {
                  ...p,
                  name: updates.name ?? p.name,
                  price: updates.price ?? p.price,
                  category_id: updates.productCategoryId ?? p.category_id,
                }
                : p
            );
            this.products$.next(updated);
          }
        })
      );
  }

  deleteProduct(id: string): void {
    this.apollo
      .mutate({
        mutation: DELETE_PRODUCT,
        variables: { id },
      })
      .subscribe({
        next: (result: any) => {
          const current = this.products$.value;
          this.products$.next(current.filter((p) => p.id !== id));
        },
        error: (err) => console.error("Error deleting product:", err),
      });
  }

  private loadProducts(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_PRODUCTS,
      })
      .valueChanges.pipe(map((result) => result.data?.products))
      .subscribe({
        next: (products) => {
          const mappedProducts: Product[] = products?.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category_id: p.productCategoryId || "",
            isPricePerKg: p.isPricePerKg || false,
            active: true,
          }));
          this.products$.next(mappedProducts);
        },
        error: (err) => console.error("Error loading products:", err),
      });
  }
}
