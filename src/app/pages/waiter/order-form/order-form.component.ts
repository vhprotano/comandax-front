import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService, Product, Category, Order, OrderItem, Table } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  orderForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  tables: Table[] = [];
  selectedCategory: string = '';
  cartItems: OrderItem[] = [];
  total = 0;
  useTableSelection = false;
  orderType: 'table' | 'delivery' = 'table';
  deliveryTime: 'now' | 'scheduled' = 'now';
  scheduledTime = '';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required]],
      table_number: ['', [Validators.required]],
    });
  }

  loadData(): void {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products;
      if (products.length > 0) {
        this.selectedCategory = products[0].category_id;
      }
    });

    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.dataService.getTables().subscribe((tables) => {
      this.tables = tables.filter((t) => t.status === 'available');
      this.useTableSelection = this.tables.length > 0;
    });
  }

  getProductsByCategory(): Product[] {
    return this.products.filter((p) => p.category_id === this.selectedCategory);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        id: Date.now().toString(),
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        status: 'pending',
      });
    }

    this.calculateTotal();
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.calculateTotal();
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.notificationService.error('Por favor, preencha o nome do cliente');
      return;
    }

    if (this.cartItems.length === 0) {
      this.notificationService.error('Adicione pelo menos um item à comanda');
      return;
    }

    if (this.orderType === 'table' && !this.orderForm.value.table_number) {
      this.notificationService.error('Selecione uma mesa');
      return;
    }

    if (this.orderType === 'delivery' && this.deliveryTime === 'scheduled' && !this.scheduledTime) {
      this.notificationService.error('Selecione o horário de entrega');
      return;
    }

    let tableNumber = '';
    if (this.orderType === 'table') {
      tableNumber = this.useTableSelection
        ? this.orderForm.value.table_number
        : `Mesa ${this.orderForm.value.table_number}`;
    } else {
      tableNumber = `Entrega - ${this.orderForm.value.customer_name}`;
    }

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customer_name: this.orderForm.value.customer_name,
      table_number: tableNumber,
      status: this.orderType === 'delivery' && this.deliveryTime === 'scheduled' ? 'scheduled' : 'open',
      items: this.cartItems,
      created_at: new Date(),
      updated_at: new Date(),
      total_price: this.total,
      waiter_id: '1', // TODO: Get from auth service
    };

    this.dataService.createOrder(newOrder);

    // Update table status if using table selection
    if (this.orderType === 'table' && this.useTableSelection) {
      const selectedTable = this.tables.find((t) => t.number === this.orderForm.value.table_number);
      if (selectedTable) {
        this.dataService.updateTable(selectedTable.id, { status: 'occupied', current_order_id: newOrder.id });
      }
    }

    const message = this.orderType === 'delivery'
      ? (this.deliveryTime === 'now' ? 'Pedido de entrega criado!' : 'Pedido agendado com sucesso!')
      : 'Comanda criada com sucesso!';

    this.notificationService.success(message);
    this.router.navigate(['/waiter']);
  }

  cancel(): void {
    this.router.navigate(['/waiter']);
  }
}

