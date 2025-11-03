import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Order } from '../models';

// ==================== GRAPHQL QUERIES ====================

const GET_CUSTOMER_TABS = gql`
  query GetCustomerTabs {
    customerTabs {
      id
      name
      table {
        id
        code
        status
      }
    }
  }
`;

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      code
      status
      products {
        productName
        unitPrice
        quantity
        totalPrice
      }
    }
  }
`;

const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: UUID!) {
    orderById(id: $id) {
      id
      code
      status
      products {
        productName
        unitPrice
        quantity
        totalPrice
      }
    }
  }
`;

const CREATE_CUSTOMER_TAB = gql`
  mutation CreateCustomerTab($input: CreateCustomerTabCommandInput!) {
    createCustomerTab(input: $input) {
      id
      name
      table {
        id
        code
        status
      }
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($command: CreateOrderCommandInput!) {
    createOrder(command: $command)
  }
`;

const ADD_PRODUCTS_TO_ORDER = gql`
  mutation AddProductsToOrder($command: AddProductsToOrderCommandInput!) {
    addProductsToOrder(command: $command)
  }
`;

const CLOSE_ORDER = gql`
  mutation CloseOrder($command: CloseOrderCommandInput!) {
    closeOrder(command: $command)
  }
`;

// ==================== SERVICE ====================

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private orders$ = new BehaviorSubject<Order[]>([]);

  constructor(private apollo: Apollo) {
    this.loadOrders();
  }

  

  getOrders(): Observable<Order[]> {
    return this.orders$.asObservable();
  }

  getOrderById(id: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: GET_ORDER_BY_ID,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data?.orderById));
  }

  createCustomerTab(tableId: string, name?: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_CUSTOMER_TAB,
        variables: {
          input: {
            tableId,
            name,
          },
        },
      })
      .pipe(
        map((result: any) => result.data?.createCustomerTab),
        tap((tab) => {
          const newOrder: Order = {
            id: tab.id,
            customer_name: tab.name || 'Cliente',
            table_number: tab.table?.code?.toString() || '',
            status: 'open',
            items: [],
            created_at: new Date(),
            updated_at: new Date(),
            total_price: 0,
            waiter_id: '',
          };
          const current = this.orders$.value;
          this.orders$.next([...current, newOrder]);
        })
      );
  }

  createOrderWithProducts(tabId: string, productIds: string[]): Observable<string> {
    return this.apollo
      .mutate({
        mutation: CREATE_ORDER,
        variables: {
          command: {
            tabId,
            productIds,
          },
        },
      })
      .pipe(map((result: any) => result.data?.createOrder));
  }

  addProductsToOrder(orderId: string, productIds: string[]): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: ADD_PRODUCTS_TO_ORDER,
        variables: {
          command: {
            orderId,
            productIds,
          },
        },
      })
      .pipe(map((result: any) => result.data?.addProductsToOrder));
  }

  closeOrder(orderId: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: CLOSE_ORDER,
        variables: {
          command: {
            orderId,
          },
        },
      })
      .pipe(
        map((result: any) => result.data?.closeOrder),
        tap((success) => {
          if (success) {
            const current = this.orders$.value;
            const updated = current?.map((o) =>
              o.id === orderId ? { ...o, status: 'closed' as const } : o
            );
            this.orders$.next(updated);
          }
        })
      );
  }

  createOrder(order: Order): void {
    const current = this.orders$.value;
    this.orders$.next([...current, order]);
  }

  updateOrder(id: string, order: Partial<Order>): void {
    const current = this.orders$.value;
    const updated = current?.map((o) => (o.id === id ? { ...o, ...order } : o));
    this.orders$.next(updated);
  }

  deleteOrder(id: string): void {
    const current = this.orders$.value;
    this.orders$.next(current.filter((o) => o.id !== id));
  }

  

  private loadOrders(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_CUSTOMER_TABS,
      })
      .valueChanges.pipe(
        map((result) => result.data?.customerTabs)
      )
      .subscribe({
        next: (tabs) => {
          const mappedOrders: Order[] = tabs?.map((tab: any) => ({
            id: tab.id,
            customer_name: tab.name || 'Cliente',
            table_number: tab.table?.code?.toString() || '',
            status: 'open',
            items: [],
            created_at: new Date(),
            updated_at: new Date(),
            total_price: 0,
            waiter_id: '',
          }));
          this.orders$.next(mappedOrders);
        },
        error: (err) => console.error('Error loading customer tabs:', err),
      });
  }
}

