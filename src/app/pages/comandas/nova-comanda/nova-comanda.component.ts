import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { DataService, Order, Product, Category, Table, OrderItem } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-nova-comanda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbOffcanvasModule],
  templateUrl: './nova-comanda.component.html',
  styleUrls: ['./nova-comanda.component.scss'],
})
export class NovaComandaComponent implements OnInit, AfterViewInit {
  @ViewChild('cartOffcanvas') cartOffcanvas!: TemplateRef<any>;
  @ViewChild('categoriesContainer') categoriesContainer!: ElementRef;

  orderForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  tables: Table[] = [];
  cartItems: OrderItem[] = [];
  total = 0;
  selectedCategory = '';
  isClosedOrder = false;
  selectedTable: Table | null = null;
  showTableSelection = false;
  showCartOffcanvas = false;

  // Scroll controls
  canScrollLeft = false;
  canScrollRight = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private notificationService: NotificationService,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    // Check if it's a closed order (Novo Pedido)
    this.isClosedOrder = this.router.url.includes('novo-pedido');

    this.initForm();
    this.loadData();
  }

  initForm(): void {
    this.orderForm = this.fb.group({
      customer_name: ['', [Validators.required]],
    });
  }

  loadData(): void {
    this.dataService.getProducts().subscribe((products) => {
      this.products = products.filter((p) => p.active);
    });

    this.dataService.getCategories().subscribe((categories) => {
      this.categories = categories;
      // Check scroll buttons after categories load
      setTimeout(() => {
        this.checkScrollButtons();
      }, 100);
    });

    this.dataService.getTables().subscribe((tables) => {
      this.tables = tables.filter((t) => t.status === 'available');
    });
  }

  getFilteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter((p) => p.category_id === this.selectedCategory);
  }

  selectTable(table: Table): void {
    this.selectedTable = table;
    this.showTableSelection = false;
  }

  removeTable(): void {
    this.selectedTable = null;
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity++;
      this.triggerCartAnimation();
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
      this.triggerCartAnimation();
    }

    this.calculateTotal();
    this.triggerProductAnimation(product.id);
  }

  triggerProductAnimation(productId: string): void {
    const element = document.querySelector(`[data-product-id="${productId}"]`);
    if (element) {
      element.classList.add('product-added-animation');
      setTimeout(() => {
        element.classList.remove('product-added-animation');
      }, 600);
    }
  }

  triggerCartAnimation(): void {
    const cartElement = document.querySelector('.cart-container');
    if (cartElement) {
      cartElement.classList.add('cart-pulse-animation');
      setTimeout(() => {
        cartElement.classList.remove('cart-pulse-animation');
      }, 600);
    }
  }

  increaseQuantity(item: OrderItem): void {
    item.quantity++;
    this.calculateTotal();
    this.triggerCartAnimation();
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
      this.triggerCartAnimation();
    } else {
      this.removeFromCart(item.id);
    }
  }

  removeFromCart(itemId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.calculateTotal();
    this.triggerCartAnimation();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }

  openCartOffcanvas(): void {
    if (window.innerWidth < 1024) {
      this.offcanvasService.open(this.cartOffcanvas, {
        position: 'bottom',
        panelClass: 'offcanvas-cart-bottom',
      });
    }
  }

  closeCartOffcanvas(): void {
    this.offcanvasService.dismiss();
  }

  submitOrder(): void {
    if (this.orderForm.invalid) {
      this.notificationService.error('Por favor, preencha o nome do cliente');
      return;
    }

    if (this.cartItems.length === 0) {
      this.notificationService.error('Adicione pelo menos um item');
      return;
    }

    const formValue = this.orderForm.value;
    const tableNumber = this.selectedTable ? this.selectedTable.number : '';

    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      customer_name: formValue.customer_name,
      table_number: tableNumber,
      status: this.isClosedOrder ? 'closed' : 'open',
      items: this.cartItems,
      created_at: new Date(),
      updated_at: new Date(),
      total_price: this.total,
      waiter_id: '1',
    };

    this.dataService.createOrder(newOrder);
    const message = this.isClosedOrder ? 'Pedido criado e fechado com sucesso!' : 'Comanda criada com sucesso!';
    this.notificationService.success(message);

    // Close offcanvas if open
    this.offcanvasService.dismiss();

    this.router.navigate(['/comandas']);
  }

  cancel(): void {
    this.router.navigate(['/comandas']);
  }

  getPageTitle(): string {
    return this.isClosedOrder ? 'Novo Pedido' : 'Nova Comanda';
  }

  ngAfterViewInit(): void {
    // Check scroll state after view init
    setTimeout(() => {
      this.checkScrollButtons();
    }, 100);
  }

  scrollCategories(direction: 'left' | 'right'): void {
    const container = this.categoriesContainer?.nativeElement;
    if (!container) return;

    const scrollAmount = 200;
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    // Update button states after scroll
    setTimeout(() => {
      this.checkScrollButtons();
    }, 300);
  }

  checkScrollButtons(): void {
    const container = this.categoriesContainer?.nativeElement;
    if (!container) return;

    this.canScrollLeft = container.scrollLeft > 0;
    this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 1);
  }
}

