import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// ==================== QUERIES ====================

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      price
      code
      needPreparation
      productCategoryId
      productCategory {
        id
        name
        icon
      }
    }
  }
`;

const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories {
    productCategories {
      id
      name
      icon
    }
  }
`;

const GET_TABLES = gql`
  query GetTables {
    tables {
      id
      code
      status
    }
  }
`;

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

// ==================== MUTATIONS ====================

const AUTHENTICATE_WITH_GOOGLE = gql`
  mutation AuthenticateWithGoogle($idToken: String!) {
    authenticateWithGoogle(idToken: $idToken) {
      jwtToken
      email
      role
    }
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($name: String!, $price: Decimal!) {
    createProduct(name: $name, price: $price) {
      id
      name
      price
      code
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

const CREATE_TABLE = gql`
  mutation CreateTable {
    createTable {
      id
      code
      status
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

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}

  // ==================== QUERY METHODS ====================

  getProducts(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_PRODUCTS,
      })
      .valueChanges.pipe(map((result) => result.data?.products));
  }

  getProductCategories(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_PRODUCT_CATEGORIES,
      })
      .valueChanges.pipe(map((result) => result.data?.productCategories));
  }

  getTables(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_TABLES,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result: any) => {
          console.log('GraphQL getTables result:', result);
          if (result.errors) {
            console.error('GraphQL errors:', result.errors);
          }
          return result.data?.tables || [];
        })
      );
  }

  getCustomerTabs(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_CUSTOMER_TABS,
      })
      .valueChanges.pipe(map((result) => result.data?.customerTabs));
  }

  getOrders(): Observable<any[]> {
    return this.apollo
      .watchQuery<any>({
        query: GET_ORDERS,
      })
      .valueChanges.pipe(map((result) => result.data?.orders));
  }

  getOrderById(id: string): Observable<any> {
    return this.apollo
      .watchQuery<any>({
        query: GET_ORDER_BY_ID,
        variables: { id },
      })
      .valueChanges.pipe(map((result) => result.data?.orderById));
  }

  // ==================== MUTATION METHODS ====================

  authenticateWithGoogle(idToken: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: AUTHENTICATE_WITH_GOOGLE,
        variables: { idToken },
      })
      .pipe(map((result: any) => result.data?.authenticateWithGoogle));
  }

  createProduct(name: string, price: number): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRODUCT,
        variables: { name, price },
      })
      .pipe(map((result: any) => result.data?.createProduct));
  }

  createProductCategory(name: string, icon?: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRODUCT_CATEGORY,
        variables: { name, icon },
      })
      .pipe(map((result: any) => result.data?.createProductCategory));
  }

  createTable(): Observable<any> {
    return this.apollo
      .mutate({
        mutation: CREATE_TABLE,
      })
      .pipe(map((result: any) => result.data?.createTable));
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

  createOrder(tabId: string, productIds: string[]): Observable<string> {
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
      .pipe(map((result: any) => result.data?.closeOrder));
  }
}

