import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Tab } from '../models';

// ==================== GRAPHQL QUERIES ====================

const GET_CUSTOMER_TABS = gql`
  query GetCustomerTabs {
  customerTabs {
    name
    id
    status
    table {
      id
      number
    }
  }
}
`;

const GET_ORDERS = gql`
  query getOrders {
    orders {
      id
      status
      customerTabId
      products {
        productId
        quantity
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
  }
`;


const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: UUID!) {
    orderById(id: $id) {
      id
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
        number
        status
      }
    }
  }
`;


const CREATE_ORDER = gql`
  mutation CreateOrder($customerTabId: UUID, $products: [CreateOrderProductInput!]!) {
    createOrder(customerTabId: $customerTabId, products: $products) {
      id
      status
      customerTabId
      products {
        productId
        quantity
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
  }
`;

const CREATE_ORDER_WITHOUT_CUSTOMER_TAB = gql`
  mutation CreateOrder($products: [CreateOrderProductInput!]!) {
    createOrder(products: $products) {
      id
      status
      products {
        productId
        quantity
        totalPrice
        product {
          id
          name
          price
        }
      }
    }
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
  private orders$ = new BehaviorSubject<Tab[]>([]);
  private isLoadingTabs = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoadingTabs.asObservable();

  constructor(private apollo: Apollo) {
    this.loadTabs();
  }

  getTabs(): Observable<Tab[]> {
    return this.orders$.asObservable();
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
          const newTab: Tab = {
            id: tab.id,
            customer_name: tab.name || 'Cliente',
            table_number: tab.table?.number?.toString() || '',
            status: 'OPEN',
            orders: tab?.orders || [],
            created_at: new Date(),
            updated_at: new Date(),
            total_price: 0
          };
          const current = this.orders$.value;
          this.orders$.next([...current, newTab]);
        })
      );
  }

  createOrderWithProducts(tabId: string | null, products: { productId: string, quantity: number }[], isClosedOrder: boolean = false): Observable<any> {
    if (!isClosedOrder) {
      return this.apollo
        .mutate({
          mutation: CREATE_ORDER,
          variables: {
            customerTabId: tabId,
            products,
          },
        })
        .pipe(
          map((result: any) => result.data?.createOrder),
          tap((order) => {
            this.loadTabs();
          })
        );
    } else {
      return this.apollo
        .mutate({
          mutation: CREATE_ORDER_WITHOUT_CUSTOMER_TAB,
          variables: {
            products,
          },
        })
        .pipe(
          map((result: any) => result.data?.createOrder),
          tap((order) => {
            this.loadTabs();
          })
        );
    }
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
              o.id === orderId ? { ...o, status: 'CLOSED' as const } : o
            );
            this.orders$.next(updated);
          }
        })
      );
  }

  private loadTabs(): void {
    this.isLoadingTabs.next(true);
    this.apollo
      .watchQuery<any>({
        query: GET_CUSTOMER_TABS,
      })
      .valueChanges.pipe(
        map((result) => result)
      )
      .subscribe({
        next: (result) => {
          if (result.data?.customerTabs) {
            const tabs = result.data?.customerTabs;
            this.loadOrders().subscribe({
              next: (orders) => {
                const closedOrders = tabs?.filter((o: any) => o.status === 'CLOSED');
                if (tabs?.length === 0) {
                  this.orders$.next([]);
                } else {

                  const mappedTabs: Tab[] = tabs?.filter((tab: any) => tab.status === 'OPEN').map((tab: any) => {
                    const normalize = (id?: string) => (id || '').replace(/-/g, '').toLowerCase();
                    const tabOrders = orders?.filter((o: any) => normalize(o?.customerTabId) === normalize(tab?.id));
                    // First, group products by their ID across all orders
                    const groupedProducts = tabOrders?.reduce((acc: any[], order: any) => {
                      order.products?.forEach((p: any) => {
                        const existingProduct = acc.find(item => item.productId === p.productId);
                        if (existingProduct) {
                          existingProduct.quantity += p.quantity;
                          existingProduct.totalPrice += p.totalPrice;
                        } else {
                          acc.push({ ...p });
                        }
                      });
                      return acc;
                    }, []) || [];
                    const ordersData = this.mapOrders(tabOrders);
                    return {
                      id: tab.id,
                      customer_name: tab.name || 'Cliente',
                      table_number: tab.table?.number?.toString() || '',
                      status: tab?.status,
                      orders: ordersData.orders,
                      created_at: new Date(),
                      updated_at: new Date(),
                      total_price: ordersData.total_price,
                    }
                  });
                  this.orders$.next(mappedTabs);
                }
                this.isLoadingTabs.next(false);
              },
              error: (err) => console.error('Error loading orders:', err),
            });
          }
        },
        error: (err) => console.error('Error loading customer tabs:', err),
      });
  }

  private loadOrders() {
    return this.apollo
      .watchQuery<any>({
        query: GET_ORDERS,
      })
      .valueChanges.pipe(
        map((result) => result.data?.orders)
      )
  }

  private mapOrders(orders: any[]) {
    const groupedProducts = orders?.reduce((acc: any[], order: any) => {
      order.products?.forEach((p: any) => {
        const existingProduct = acc.find(item => item.productId === p.productId);
        if (existingProduct) {
          existingProduct.quantity += p.quantity;
          existingProduct.totalPrice += p.totalPrice;
        } else {
          acc.push({ ...p });
        }
      });
      return acc;
    }, []) || [];
    return {
      orders: [{
        products: groupedProducts.map((p: any) => ({
          product_id: p.productId,
          product_name: p.product?.name,
          quantity: p.quantity,
          totalPrice: p.totalPrice,
          unit_price: p.product?.price,
          status: 'pending' as const,
        }))
      }], total_price: groupedProducts.reduce((sum: number, p: any) => sum + p.totalPrice, 0)
    }
  }
}

