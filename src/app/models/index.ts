// ==================== PRODUCT MODELS ====================

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
}

// ==================== ORDER MODELS ====================
export interface Order {
  id: string;
  status: 'OPEN' | 'CLOSED';
  tab_id: string;
  products: OrderItem[];
  created_at: Date;
  updated_at: Date;
  total_price: number;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  status: 'CREATED' | 'IN_PREPARATION' | 'CLOSED';
}

export interface Tab {
  id: string;
  customer_name: string;
  table_number?: any;
  status: 'CREATED' | 'CLOSED';
  orders: Order[];
  created_at: Date;
  updated_at: Date;
  total_price: number;
  waiter_id?: string;
}

// ==================== EMPLOYEE MODELS ====================

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  phone?: string;
  active: boolean;
  created_at: Date;
}

// ==================== TABLE MODELS ====================

export interface Table {
  id: string;
  number: string;
  status: 'FREE' | 'BUSY';
  tab?: Tab;
}

// ==================== ACTIVITY MODELS ====================

export interface Activity {
  id: string;
  type: 'order' | 'product' | 'employee' | 'table' | 'payment';
  action: string;
  description: string;
  timestamp: Date;
  icon: string;
  badge_type: 'success' | 'info' | 'warning' | 'danger' | 'primary';
}

// ==================== AUTH MODELS ====================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'MANAGER' | 'WAITER' | 'KITCHEN';
  establishment_id?: string;
  picture?: string;
}

