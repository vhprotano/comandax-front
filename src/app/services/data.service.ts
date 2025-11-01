import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category_id: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  status: 'pending' | 'ready';
}

export interface Order {
  id: string;
  customer_name: string;
  table_number: string;
  status: 'open' | 'sent' | 'completed' | 'closed' | 'scheduled';
  items: OrderItem[];
  created_at: Date;
  updated_at: Date;
  total_price: number;
  waiter_id: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  phone?: string;
  active: boolean;
  created_at: Date;
}

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  current_order_id?: string;
}

export interface Activity {
  id: string;
  type: 'order' | 'product' | 'employee' | 'table' | 'payment';
  action: string;
  description: string;
  timestamp: Date;
  icon: string;
  badge_type: 'success' | 'info' | 'warning' | 'danger' | 'primary';
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private products$ = new BehaviorSubject<Product[]>([]);
  private categories$ = new BehaviorSubject<Category[]>([]);
  private orders$ = new BehaviorSubject<Order[]>([]);
  private employees$ = new BehaviorSubject<Employee[]>([]);
  private tables$ = new BehaviorSubject<Table[]>([]);
  private activities$ = new BehaviorSubject<Activity[]>([]);

  constructor() {
    this.loadMockData();
  }

  private loadMockData(): void {
    // Mock categories
    const mockCategories: Category[] = [
      { id: '1', name: 'Bebidas', icon: '🥤', color: '#3B82F6' },
      { id: '2', name: 'Pratos Principais', icon: '🍽️', color: '#EF4444' },
      { id: '3', name: 'Sobremesas', icon: '🍰', color: '#F59E0B' },
      { id: '4', name: 'Entradas', icon: '🥗', color: '#10B981' },
      { id: '5', name: 'Lanches', icon: '🌮', color: '#8B5CF6' },
      { id: '6', name: 'Café', icon: '☕', color: '#92400E' },
    ];

    // Mock products - Expandido
    const mockProducts: Product[] = [
      // Bebidas
      { id: '1', name: 'Refrigerante 350ml', price: 5.0, category_id: '1', active: true },
      { id: '2', name: 'Suco Natural', price: 8.0, category_id: '1', active: true },
      { id: '3', name: 'Água com Gás', price: 4.0, category_id: '1', active: true },
      { id: '4', name: 'Cerveja Artesanal', price: 12.0, category_id: '1', active: true },
      { id: '5', name: 'Vinho Tinto', price: 35.0, category_id: '1', active: true },
      // Pratos Principais
      { id: '6', name: 'Hambúrguer Clássico', price: 25.0, category_id: '2', active: true },
      { id: '7', name: 'Pizza Margherita', price: 35.0, category_id: '2', active: true },
      { id: '8', name: 'Frango à Parmegiana', price: 32.0, category_id: '2', active: true },
      { id: '9', name: 'Bife à Milanesa', price: 38.0, category_id: '2', active: true },
      { id: '10', name: 'Macarrão à Carbonara', price: 28.0, category_id: '2', active: true },
      { id: '11', name: 'Salmão Grelhado', price: 45.0, category_id: '2', active: true },
      // Sobremesas
      { id: '12', name: 'Bolo de Chocolate', price: 12.0, category_id: '3', active: true },
      { id: '13', name: 'Pudim de Leite Condensado', price: 10.0, category_id: '3', active: true },
      { id: '14', name: 'Sorvete (3 bolas)', price: 15.0, category_id: '3', active: true },
      { id: '15', name: 'Brownie com Calda', price: 14.0, category_id: '3', active: true },
      // Entradas
      { id: '16', name: 'Salada Caesar', price: 18.0, category_id: '4', active: true },
      { id: '17', name: 'Batata Frita', price: 12.0, category_id: '4', active: true },
      { id: '18', name: 'Aros de Cebola', price: 14.0, category_id: '4', active: true },
      { id: '19', name: 'Camarão à Milanesa', price: 22.0, category_id: '4', active: true },
      // Lanches
      { id: '20', name: 'Sanduíche de Frango', price: 16.0, category_id: '5', active: true },
      { id: '21', name: 'Pastel de Queijo', price: 8.0, category_id: '5', active: true },
      { id: '22', name: 'Coxinha', price: 6.0, category_id: '5', active: true },
      // Café
      { id: '23', name: 'Café Expresso', price: 4.0, category_id: '6', active: true },
      { id: '24', name: 'Cappuccino', price: 7.0, category_id: '6', active: true },
      { id: '25', name: 'Café com Leite', price: 5.0, category_id: '6', active: true },
    ];

    // Mock employees - Expandido
    const mockEmployees: Employee[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@restaurant.com',
        role: 'WAITER',
        phone: '(11) 98765-4321',
        active: true,
        created_at: new Date('2024-01-15'),
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@restaurant.com',
        role: 'KITCHEN',
        phone: '(11) 98765-4322',
        active: true,
        created_at: new Date('2024-01-10'),
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        email: 'pedro@restaurant.com',
        role: 'WAITER',
        phone: '(11) 98765-4323',
        active: true,
        created_at: new Date('2024-02-01'),
      },
      {
        id: '4',
        name: 'Ana Costa',
        email: 'ana@restaurant.com',
        role: 'KITCHEN',
        phone: '(11) 98765-4324',
        active: true,
        created_at: new Date('2024-02-05'),
      },
      {
        id: '5',
        name: 'Carlos Mendes',
        email: 'carlos@restaurant.com',
        role: 'WAITER',
        phone: '(11) 98765-4325',
        active: true,
        created_at: new Date('2024-02-10'),
      },
      {
        id: '6',
        name: 'Fernanda Rocha',
        email: 'fernanda@restaurant.com',
        role: 'MANAGER',
        phone: '(11) 98765-4326',
        active: true,
        created_at: new Date('2024-01-01'),
      },
      {
        id: '7',
        name: 'Lucas Ferreira',
        email: 'lucas@restaurant.com',
        role: 'KITCHEN',
        phone: '(11) 98765-4327',
        active: false,
        created_at: new Date('2024-03-01'),
      },
    ];

    // Mock orders - Expandido
    const mockOrders: Order[] = [
      {
        id: 'ORD001',
        customer_name: 'Cliente 1',
        table_number: 'Mesa 1',
        status: 'closed',
        items: [
          { id: '1', product_id: '6', product_name: 'Hambúrguer Clássico', quantity: 2, unit_price: 25.0, status: 'ready' },
          { id: '2', product_id: '1', product_name: 'Refrigerante 350ml', quantity: 2, unit_price: 5.0, status: 'ready' },
        ],
        created_at: new Date('2024-10-28 12:30'),
        updated_at: new Date('2024-10-28 13:00'),
        total_price: 60.0,
        waiter_id: '1',
      },
      {
        id: 'ORD002',
        customer_name: 'Cliente 2',
        table_number: 'Mesa 3',
        status: 'closed',
        items: [
          { id: '1', product_id: '7', product_name: 'Pizza Margherita', quantity: 1, unit_price: 35.0, status: 'ready' },
          { id: '2', product_id: '4', product_name: 'Cerveja Artesanal', quantity: 2, unit_price: 12.0, status: 'ready' },
        ],
        created_at: new Date('2024-10-28 13:15'),
        updated_at: new Date('2024-10-28 14:00'),
        total_price: 59.0,
        waiter_id: '1',
      },
      {
        id: 'ORD003',
        customer_name: 'Cliente 3',
        table_number: 'Mesa 5',
        status: 'sent',
        items: [
          { id: '1', product_id: '8', product_name: 'Frango à Parmegiana', quantity: 1, unit_price: 32.0, status: 'pending' },
          { id: '2', product_id: '17', product_name: 'Batata Frita', quantity: 1, unit_price: 12.0, status: 'pending' },
        ],
        created_at: new Date('2024-10-28 14:30'),
        updated_at: new Date('2024-10-28 14:35'),
        total_price: 44.0,
        waiter_id: '3',
      },
      {
        id: 'ORD004',
        customer_name: 'Cliente 4',
        table_number: 'Mesa 2',
        status: 'open',
        items: [
          { id: '1', product_id: '11', product_name: 'Salmão Grelhado', quantity: 1, unit_price: 45.0, status: 'pending' },
        ],
        created_at: new Date('2024-10-28 15:00'),
        updated_at: new Date('2024-10-28 15:00'),
        total_price: 45.0,
        waiter_id: '3',
      },
    ];

    // Mock tables
    const mockTables: Table[] = [
      { id: '1', number: '1', capacity: 2, status: 'available' },
      { id: '2', number: '2', capacity: 2, status: 'occupied', current_order_id: 'ORD004' },
      { id: '3', number: '3', capacity: 4, status: 'available' },
      { id: '4', number: '4', capacity: 4, status: 'available' },
      { id: '5', number: '5', capacity: 6, status: 'occupied', current_order_id: 'ORD003' },
      { id: '6', number: '6', capacity: 6, status: 'available' },
      { id: '7', number: '7', capacity: 8, status: 'available' },
      { id: '8', number: '8', capacity: 8, status: 'available' },
    ];

    // Mock activities
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'order',
        action: 'Pedido #1234 finalizado',
        description: 'Pedido da Mesa 1 foi finalizado e pago',
        timestamp: new Date(Date.now() - 2 * 60000),
        icon: '✅',
        badge_type: 'success',
      },
      {
        id: '2',
        type: 'product',
        action: 'Novo produto adicionado',
        description: 'Salmão Grelhado foi adicionado ao cardápio',
        timestamp: new Date(Date.now() - 15 * 60000),
        icon: '📝',
        badge_type: 'info',
      },
      {
        id: '3',
        type: 'employee',
        action: 'Novo funcionário cadastrado',
        description: 'Lucas Ferreira foi adicionado como cozinheiro',
        timestamp: new Date(Date.now() - 60 * 60000),
        icon: '👤',
        badge_type: 'primary',
      },
      {
        id: '4',
        type: 'order',
        action: 'Pedido enviado para cozinha',
        description: 'Pedido #1233 foi enviado para preparação',
        timestamp: new Date(Date.now() - 90 * 60000),
        icon: '📤',
        badge_type: 'warning',
      },
      {
        id: '5',
        type: 'table',
        action: 'Mesa reservada',
        description: 'Mesa 5 foi reservada para 4 pessoas',
        timestamp: new Date(Date.now() - 120 * 60000),
        icon: '🪑',
        badge_type: 'info',
      },
    ];

    this.categories$.next(mockCategories);
    this.products$.next(mockProducts);
    this.employees$.next(mockEmployees);
    this.orders$.next(mockOrders);
    this.tables$.next(mockTables);
    this.activities$.next(mockActivities);
  }

  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  getOrders(): Observable<Order[]> {
    return this.orders$.asObservable();
  }

  getEmployees(): Observable<Employee[]> {
    return this.employees$.asObservable();
  }

  addProduct(product: Product): void {
    const current = this.products$.value;
    this.products$.next([...current, product]);
  }

  updateProduct(id: string, product: Partial<Product>): void {
    const current = this.products$.value;
    const updated = current.map((p) => (p.id === id ? { ...p, ...product } : p));
    this.products$.next(updated);
  }

  deleteProduct(id: string): void {
    const current = this.products$.value;
    this.products$.next(current.filter((p) => p.id !== id));
  }

  addCategory(category: Category): void {
    const current = this.categories$.value;
    this.categories$.next([...current, category]);
  }

  updateCategory(id: string, category: Partial<Category>): void {
    const current = this.categories$.value;
    const updated = current.map((c) =>
      c.id === id ? { ...c, ...category } : c
    );
    this.categories$.next(updated);
  }

  deleteCategory(id: string): void {
    const current = this.categories$.value;
    this.categories$.next(current.filter((c) => c.id !== id));
  }

  createOrder(order: Order): void {
    const current = this.orders$.value;
    this.orders$.next([...current, order]);
  }

  updateOrder(id: string, order: Partial<Order>): void {
    const current = this.orders$.value;
    const updated = current.map((o) => (o.id === id ? { ...o, ...order } : o));
    this.orders$.next(updated);
  }

  deleteOrder(id: string): void {
    const current = this.orders$.value;
    this.orders$.next(current.filter((o) => o.id !== id));
  }

  addEmployee(employee: Employee): void {
    const current = this.employees$.value;
    this.employees$.next([...current, employee]);
  }

  updateEmployee(id: string, employee: Partial<Employee>): void {
    const current = this.employees$.value;
    const updated = current.map((e) =>
      e.id === id ? { ...e, ...employee } : e
    );
    this.employees$.next(updated);
  }

  deleteEmployee(id: string): void {
    const current = this.employees$.value;
    this.employees$.next(current.filter((e) => e.id !== id));
  }

  getTables(): Observable<Table[]> {
    return this.tables$.asObservable();
  }

  getActivities(): Observable<Activity[]> {
    return this.activities$.asObservable();
  }

  addTable(table: Table): void {
    const current = this.tables$.value;
    this.tables$.next([...current, table]);
  }

  updateTable(id: string, table: Partial<Table>): void {
    const current = this.tables$.value;
    const updated = current.map((t) => (t.id === id ? { ...t, ...table } : t));
    this.tables$.next(updated);
  }

  deleteTable(id: string): void {
    const current = this.tables$.value;
    this.tables$.next(current.filter((t) => t.id !== id));
  }

  addActivity(activity: Activity): void {
    const current = this.activities$.value;
    this.activities$.next([activity, ...current]);
  }

  getAvailableTables(): Observable<Table[]> {
    return this.tables$.asObservable().pipe(
      // @ts-ignore
      map((tables) => tables.filter((t) => t.status === 'available'))
    );
  }
}

