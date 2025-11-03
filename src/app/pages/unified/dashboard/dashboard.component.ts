import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { RealtimeService } from '../../../services/realtime.service';
import { ProductsComponent } from '../../manager/products/products.component';
import { CategoriesComponent } from '../../manager/categories/categories.component';
import { TableViewComponent } from '../../manager/table-view/table-view.component';
import { ReceiptComponent } from '../../../components/receipt/receipt.component';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { Category, Order, OrderItem, Product, Table } from 'src/app/models';
import { OrdersService } from 'src/app/services/orders.service';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { TablesService } from 'src/app/services/tables.service';

@Component({
  selector: 'app-unified-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsComponent,
    CategoriesComponent,
    TableViewComponent,
    ReceiptComponent,
    LucideAngularModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class UnifiedDashboardComponent implements OnInit, OnDestroy {
  // Navigation
  activeSection: 'comandas' | 'nova-comanda' | 'novo-pedido' | 'cozinha' | 'gestao' = 'comandas';
  activeGestaoTab: 'produtos' | 'categorias' | 'mesas' = 'produtos';
  sidebarCollapsed = false;

  // User
  userName = 'Usuário';

  // Comandas
  orders: Order[] = [];
  closedOrders: Order[] = [];
  selectedOrder: Order | null = null;
  selectedOrderForReceipt: Order | null = null;
  showNewOrderForm = false;
  showAddItemsForm = false;
  isClosedOrder = false; // Para "Novo Pedido" (já fechado)
  showClosedOrders = false; // Toggle para mostrar comandas abertas ou fechadas

  // New Order Form
  orderForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  tables: Table[] = [];
  selectedCategory: string = '';
  cartItems: OrderItem[] = [];
  total = 0;
  orderType: 'table' | 'delivery' = 'table';
  useTableSelection = false;

  private destroy$ = new Subject<void>();

  readonly Plus = Plus;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private realtimeService: RealtimeService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private tablesService: TablesService
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
    this.initForm();
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
    this.loadTables();

    // Check for orderId query param (from table click)
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.openOrderFromTable(params['orderId']);
      }
    });
  }

  openOrderFromTable(orderId: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.activeSection = 'comandas';
      this.selectedOrderForReceipt = order;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required]],
      table_number: ['', [Validators.required]],
      table_id: [''],
    });
  }

  // Navigation
  setActiveSection(section: 'comandas' | 'cozinha' | 'gestao'): void {
    if (section === 'cozinha') {
      return; // Bloqueado
    }
    this.activeSection = section;
  }

  setActiveGestaoTab(tab: 'produtos' | 'categorias' | 'mesas'): void {
    this.activeGestaoTab = tab;
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Data Loading
  loadOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      // Filtrar apenas status 'open' e 'closed'
      this.orders = orders.filter((o) => o.status === 'open');
      this.closedOrders = orders.filter((o) => o.status === 'closed');
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products;
      if (products.length > 0 && !this.selectedCategory) {
        this.selectedCategory = products[0].category_id;
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadTables(): void {
    this.tablesService.getTables().subscribe((tables) => {
      this.tables = tables.filter((t) => t.status === 'FREE');
    });
  }

  // Comandas Actions
  openNewOrderForm(): void {
    this.activeSection = 'nova-comanda';
    this.isClosedOrder = false;
    this.resetOrderForm();
  }

  openNewClosedOrderForm(): void {
    this.activeSection = 'novo-pedido';
    this.isClosedOrder = true;
    this.resetOrderForm();
  }

  backToComandasList(): void {
    this.activeSection = 'comandas';
    this.resetOrderForm();
  }

  openAddItemsForm(order: Order): void {
    this.selectedOrder = order;
    this.showAddItemsForm = true;
    this.showNewOrderForm = false;
    this.cartItems = [];
    this.total = 0;
  }

  closeOrderForms(): void {
    this.showNewOrderForm = false;
    this.showAddItemsForm = false;
    this.selectedOrder = null;
    this.isClosedOrder = false;
    this.resetOrderForm();
  }

  resetOrderForm(): void {
    this.orderForm.reset();
    this.cartItems = [];
    this.total = 0;
    this.selectedCategory = '';
    this.orderType = 'table';
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetail(): void {
    this.selectedOrder = null;
  }

  // Cart Management
  getAvailableTables(): Table[] {
    return this.tables.filter((t) => t.status === 'FREE');
  }

  getFilteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products.filter((p) => p.active);
    }
    return this.products.filter((p) => p.category_id === this.selectedCategory && p.active);
  }

  getProductsByCategory(): Product[] {
    return this.products.filter((p) => p.category_id === this.selectedCategory && p.active);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product_id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      const newItem: OrderItem = {
        id: `ITEM${Date.now()}${Math.random()}`,
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        status: 'pending',
      };
      this.cartItems.push(newItem);
    }
    
    this.calculateTotal();
    this.triggerAddAnimation(product.id);
  }

  triggerAddAnimation(productId: string): void {
    // Implementar animação visual
    const element = document.querySelector(`[data-product-id="${productId}"]`);
    if (element) {
      element.classList.add('product-added-animation');
      setTimeout(() => {
        element.classList.remove('product-added-animation');
      }, 600);
    }
  }

  increaseQuantity(item: OrderItem): void {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    } else {
      this.removeFromCart(item.id);
    }
  }

  updateQuantity(itemId: string, quantity: number): void {
    const item = this.cartItems.find((i) => i.id === itemId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.calculateTotal();
    }
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  // Order Submission
  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.cartItems.length === 0) {
      this.notificationService.error('Adicione pelo menos um item');
      return;
    }

    const formValue = this.orderForm.value;
    let tableNumber = '';

    if (formValue.table_id) {
      const selectedTable = this.tables.find((t) => t.id === formValue.table_id);
      tableNumber = selectedTable ? selectedTable.number : '';
    }

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customer_name: formValue.customer_name,
      table_number: tableNumber,
      status: this.activeSection === 'novo-pedido' ? 'closed' : 'open',
      items: this.cartItems,
      created_at: new Date(),
      updated_at: new Date(),
      total_price: this.total,
      waiter_id: '1',
    };

    this.ordersService.createOrder(newOrder);
    const message = this.activeSection === 'novo-pedido' ? 'Pedido criado e fechado com sucesso!' : 'Comanda criada com sucesso!';
    this.notificationService.success(message);
    this.backToComandasList();
    this.loadOrders();
  }

  submitNewOrder(): void {
    this.submitOrder();
  }

  submitAddItems(): void {
    if (!this.selectedOrder || this.cartItems.length === 0) {
      this.notificationService.error('Adicione pelo menos um item');
      return;
    }

    const updatedItems = [...this.selectedOrder.items, ...this.cartItems];
    const updatedTotal = updatedItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    this.ordersService.updateOrder(this.selectedOrder.id, {
      items: updatedItems,
      total_price: updatedTotal,
      updated_at: new Date(),
    });

    this.notificationService.success('Itens adicionados à comanda!');
    this.closeOrderForms();
    this.loadOrders();
  }

  closeOrder(order: Order): void {
    this.selectedOrderForReceipt = order;
  }

  finalizeOrder(event: { orderId: string; paymentMethod: string }): void {
    this.ordersService.updateOrder(event.orderId, { status: 'closed' });
    this.notificationService.success('Comanda fechada com sucesso!');
    this.closeReceipt();
    this.loadOrders();
  }

  closeReceipt(): void {
    this.selectedOrderForReceipt = null;
  }

  printReceipt(): void {
    this.notificationService.success('Recibo enviado para impressão!');
  }
}

