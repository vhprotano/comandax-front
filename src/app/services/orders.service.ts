import { Injectable } from "@angular/core";
import { Apollo, gql } from "apollo-angular";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { finalize, map, take, tap } from "rxjs/operators";
import { Tab } from "../models";

// ==================== GRAPHQL QUERIES ====================
const SEND_CUSTOMER_TAB_EMAIL = gql`
  mutation SendCustomerTabEmail($customerTabId: UUID!, $email: String!) {
    sendCustomerTabEmail(customerTabId: $customerTabId, email: $email)
  }
`;

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
            isPricePerKg
          }
        }
      }
    }
  }
`;

const GET_CUSTOMER_TABS_BY_STATUS = gql`
  query GetCustomerTabsByStatus($status: CustomerTabStatusEnum!) {
    customerTabs(status: $status) {
      id
      name
      status
      createdAt
      updatedAt
      table {
        id
        number
      }
      orders {
        id
        status
        customerTabId
        createdAt
        updatedAt
        products {
          productId
          quantity
          totalPrice
          product {
            id
            name
            price
            isPricePerKg
          }
        }
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
          isPricePerKg
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
  mutation CreateOrder(
    $customerTabId: UUID
    $products: [CreateOrderProductInput!]!
  ) {
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
          isPricePerKg
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
          isPricePerKg
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

const CLOSE_CUSTOMER_TAB = gql`
  mutation CloseCustomerTab($command: CloseCustomerTabCommandInput!) {
    closeCustomerTab(command: $command)
  }
`;

const DELETE_CUSTOMER_TAB = gql`
  mutation DeleteCustomerTab($id: UUID!) {
    deleteCustomerTab(id: $id)
  }
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: UUID!) {
    deleteOrder(id: $id)
  }
`;

// ==================== SERVICE ====================

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private tabs$ = new BehaviorSubject<Tab[]>([]);
  private closedTabs$ = new BehaviorSubject<Tab[]>([]);
  private isLoadingTabs = new BehaviorSubject<boolean>(false);
  public loading$ = this.isLoadingTabs.asObservable();

  constructor(private apollo: Apollo) {
    // Don't load tabs in constructor - let components trigger the load
  }

  getTabs(): Observable<Tab[]> {
    return this.tabs$.asObservable();
  }

  getClosedTabs(): Observable<Tab[]> {
    return this.closedTabs$.asObservable();
  }

  // Fetch customer tabs filtered by status (e.g. 'CLOSED')
  getTabsByStatus(status: "OPEN" | "CLOSED"): Observable<Tab[]> {
    return this.apollo
      .query<any>({
        query: GET_CUSTOMER_TABS_BY_STATUS,
        variables: { status },
        fetchPolicy: "network-only",
      })
      .pipe(
        map((result) => {
          const tabs =
            result.data?.customerTabs?.map((tab: any) => {
              const normalize = (id?: string) =>
                (id || "").replace(/-/g, "").toLowerCase();
              const tabOrders = tab?.orders?.filter(
                (o: any) => normalize(o?.customerTabId) === normalize(tab?.id)
              );
              // Sort orders by creation date (descending - newest first)
              tabOrders?.sort((a: any, b: any) => {
                const dateA = new Date(a.createdAt || a.created_at).getTime();
                const dateB = new Date(b.createdAt || b.created_at).getTime();
                return dateB - dateA;
              });
              // First, group products by their ID across all orders
              const ordersData = this.mapOrders(tabOrders);
              return {
                id: tab.id,
                customer_name: tab.name || "Cliente",
                table_number: tab.table?.number?.toString() || "",
                status: tab?.status,
                orders: ordersData.orders,
                created_at: new Date(
                  tab.createdAt || tab.created_at || new Date()
                ),
                updated_at: new Date(
                  tab.updatedAt || tab.updated_at || new Date()
                ),
                total_price: ordersData.total_price,
              };
            }) || [];
          // Sort customer tabs by creation date (descending - newest first)
          tabs.sort((a: Tab, b: Tab) => {
            return b.created_at.getTime() - a.created_at.getTime();
          });
          return tabs;
        })
      );
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
      .pipe(map((result: any) => result.data?.createCustomerTab));
  }

  createOrderWithProducts(
    tabId: string | null,
    products: { productId: string; quantity: number }[],
    isClosedOrder = false
  ): Observable<any> {
    if (!isClosedOrder) {
      return this.apollo
        .mutate({
          mutation: CREATE_ORDER,
          variables: {
            customerTabId: tabId,
            products,
          },
        })
        .pipe(map((result: any) => result.data?.createOrder));
    } else {
      return this.apollo
        .mutate({
          mutation: CREATE_ORDER_WITHOUT_CUSTOMER_TAB,
          variables: {
            products,
          },
        })
        .pipe(map((result: any) => result.data?.createOrder));
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
            const current = this.tabs$.value;
            const updated = current?.map((o) =>
              o.id === orderId ? { ...o, status: "CLOSED" as const } : o
            );
            this.tabs$.next(updated);
          }
        })
      );
  }

  // Close a customer tab by its id using the closeCustomerTab mutation
  closeCustomerTab(customerTabId: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: CLOSE_CUSTOMER_TAB,
        variables: {
          command: {
            customerTabId,
          },
        },
      })
      .pipe(
        map((result: any) => result.data?.closeCustomerTab),
        tap((success) => {
          if (success) {
            const current = this.tabs$.value;
            const updated = current?.map((o) =>
              o.id === customerTabId ? { ...o, status: "CLOSED" as const } : o
            );
            this.tabs$.next(updated);
          }
        })
      );
  }

  loadTabs(): void {
    this.isLoadingTabs.next(true);

    forkJoin({
      open: this.getTabsByStatus("OPEN"),
      closed: this.getTabsByStatus("CLOSED"),
    })
      .pipe(finalize(() => this.isLoadingTabs.next(false)))
      .subscribe({
        next: (result) => {
          this.tabs$.next(result.open);
          this.closedTabs$.next(result.closed);
        },
        error: (err) => {
          console.error("Error loading tabs:", err);
        },
      });
  }

  private loadOrders() {
    return this.apollo
      .watchQuery<any>({
        query: GET_ORDERS,
      })
      .valueChanges.pipe(map((result) => result.data?.orders));
  }

  private mapOrders(orders: any[]) {
    const groupedProducts =
      orders?.reduce((acc: any[], order: any) => {
        order.products?.forEach((p: any) => {
          const existingProduct = acc.find(
            (item) => item.productId === p.productId && !item?.product?.isPricePerKg
          );
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
      orders: [
        {
          products: groupedProducts.map((p: any) => ({
            product_id: p.productId,
            product_name: p.product?.name,
            quantity: p.quantity,
            totalPrice: p.totalPrice,
            unit_price: p.product?.price,
            status: "pending" as const,
            isPricePerKg: p?.product?.isPricePerKg,
          })),
        },
      ],
      total_price: groupedProducts.reduce(
        (sum: number, p: any) => sum + p.totalPrice,
        0
      ),
    };
  }

  sendCustomerTabEmail(customerTabId: string, email: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: SEND_CUSTOMER_TAB_EMAIL,
        variables: {
          customerTabId,
          email,
        },
      })
      .pipe(map((result: any) => result.data?.sendCustomerTabEmail));
  }

  deleteCustomerTab(id: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: DELETE_CUSTOMER_TAB,
        variables: { id },
      })
      .pipe(
        map((result: any) => result.data?.deleteCustomerTab),
        tap((deleted: boolean) => {
          if (deleted) {
            // Remove from both open and closed tabs
            const currentOpen = this.tabs$.value;
            const currentClosed = this.closedTabs$.value;
            this.tabs$.next(currentOpen.filter((t) => t.id !== id));
            this.closedTabs$.next(currentClosed.filter((t) => t.id !== id));
          }
        })
      );
  }

  deleteOrder(id: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: DELETE_ORDER,
        variables: { id },
      })
      .pipe(
        map((result: any) => result.data?.deleteOrder),
        tap((deleted: boolean) => {
          if (deleted) {
            // Reload tabs to reflect the changes
            this.loadTabs();
          }
        })
      );
  }
}
