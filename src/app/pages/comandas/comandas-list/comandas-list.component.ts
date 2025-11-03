import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { Order, Product, Category } from '../../../models';
import { OrdersService } from '../../../services/orders.service';
import { ProductsService } from '../../../services/products.service';
import { CategoriesService } from '../../../services/categories.service';
import { NotificationService } from '../../../services/notification.service';
import { ReceiptComponent } from '../../../components/receipt/receipt.component';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-comandas-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ReceiptComponent, NgbOffcanvasModule, LucideAngularModule],
  templateUrl: './comandas-list.component.html',
  styleUrls: ['./comandas-list.component.scss'],
})
export class ComandasListComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  closedOrders: Order[] = [];
  showClosedOrders = false;
  maxItemsToShow = 3; // Limite de itens a mostrar

  // FAB Menu
  fabExpanded = false;

  // Detalhes da comanda
  selectedOrder: Order | null = null;

  // Adicionar itens
  showAddItemsModal = false;
  addItemsForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = '';
  cartItems: any[] = [];
  cartTotal = 0;

  // Recibo
  selectedOrderForReceipt: Order | null = null;

  // Scroll controls for mobile categories
  canScrollLeftMobile = false;
  canScrollRightMobile = false;

  @ViewChild('orderDetailOffcanvas') orderDetailOffcanvas!: TemplateRef<any>;
  @ViewChild('addItemsOffcanvas') addItemsOffcanvas!: TemplateRef<any>;
  @ViewChild('categoriesContainerMobile') categoriesContainerMobile!: ElementRef;

  readonly Plus = Plus;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadProducts();
    this.loadCategories();
    this.initAddItemsForm();
  }

  initAddItemsForm(): void {
    this.addItemsForm = this.fb.group({});
  }

  loadOrders(): void {
    this.ordersService.getOrders().subscribe((orders) => {
      this.orders = orders.filter((o) => o.status === 'open');
      this.closedOrders = orders.filter((o) => o.status === 'closed');
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products.filter((p) => p.active);
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
      // Check scroll buttons after categories load
      setTimeout(() => {
        this.checkScrollButtonsMobile();
      }, 100);
    });
  }

  getDisplayItems(order: Order): any[] {
    return order.items.slice(0, this.maxItemsToShow);
  }

  hasMoreItems(order: Order): boolean {
    return order.items.length > this.maxItemsToShow;
  }

  getRemainingItemsCount(order: Order): number {
    return order.items.length - this.maxItemsToShow;
  }

  openOrder(order: Order): void {
    this.selectedOrder = order;

    // Use offcanvas em mobile/tablet, modal em desktop
    if (window.innerWidth < 1024) {
      this.offcanvasService.open(this.orderDetailOffcanvas, {
        position: 'bottom',
        panelClass: 'offcanvas-bottom-full',
      });
    }
  }

  closeOrderDetail(): void {
    this.selectedOrder = null;
    this.offcanvasService.dismiss();
  }

  toggleFab(): void {
    this.fabExpanded = !this.fabExpanded;
  }

  createNewComanda(): void {
    this.fabExpanded = false; // Close FAB menu
    this.router.navigate(['/comandas/nova']);
  }

  createNewPedido(): void {
    this.fabExpanded = false; // Close FAB menu
    this.router.navigate(['/comandas/novo-pedido']);
  }

  // Adicionar Itens
  openAddItemsModal(order: Order, event: Event): void {
    event.stopPropagation();
    this.selectedOrder = order;
    this.showAddItemsModal = true;
    this.cartItems = [];
    this.cartTotal = 0;
    this.selectedCategory = '';

    // Fechar offcanvas de detalhes se estiver aberto
    this.offcanvasService.dismiss();

    // Use offcanvas em mobile/tablet, modal em desktop
    if (window.innerWidth < 1024) {
      this.offcanvasService.open(this.addItemsOffcanvas, {
        position: 'bottom',
        panelClass: 'offcanvas-bottom-full',
      });
    }
  }

  closeAddItemsModal(): void {
    this.showAddItemsModal = false;
    this.cartItems = [];
    this.cartTotal = 0;
    this.offcanvasService.dismiss();
  }

  getFilteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter((p) => p.category_id === this.selectedCategory);
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
      });
    }

    this.updateCartTotal();
    this.triggerProductAnimation(product.id);
  }

  increaseQuantity(item: any): void {
    item.quantity++;
    this.updateCartTotal();
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.cartItems = this.cartItems.filter((i) => i !== item);
    }
    this.updateCartTotal();
  }

  updateCartTotal(): void {
    this.cartTotal = this.cartItems.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
  }

  triggerProductAnimation(productId: string): void {
    const productElement = document.querySelector(`[data-product-id="${productId}"]`);
    if (productElement) {
      productElement.classList.add('product-added-animation');
      setTimeout(() => {
        productElement.classList.remove('product-added-animation');
      }, 600);
    }
  }

  submitAddItems(): void {
    if (!this.selectedOrder || this.cartItems.length === 0) {
      return;
    }

    this.ordersService.updateOrder(this.selectedOrder.id, {
      items: [...this.selectedOrder.items, ...this.cartItems],
      total_price: this.selectedOrder.total_price + this.cartTotal,
    });

    this.notificationService.success('Itens adicionados com sucesso!');
    this.loadOrders();
    this.closeAddItemsModal();
  }

  // Fechar Comanda
  closeOrderAction(order: Order, event: Event): void {
    event.stopPropagation();
    this.selectedOrderForReceipt = order;
  }

  onReceiptClose(): void {
    this.selectedOrderForReceipt = null;
    this.loadOrders();
  }

  // Finalizar Comanda (chamado pelo Receipt component)
  finalizeOrder(event: { orderId: string; paymentMethod: string }): void {
    this.ordersService.closeOrder(event.orderId).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.success('Comanda fechada com sucesso!');
          this.selectedOrderForReceipt = null;
          this.loadOrders();
        } else {
          this.notificationService.error('Erro ao fechar comanda');
        }
      },
      error: (err) => {
        console.error('Error closing order:', err);
        this.notificationService.error('Erro ao fechar comanda');
      },
    });
  }

  ngAfterViewInit(): void {
    // Check scroll state after view init
    setTimeout(() => {
      this.checkScrollButtonsMobile();
    }, 100);
  }

  scrollCategoriesMobile(direction: 'left' | 'right'): void {
    const container = this.categoriesContainerMobile?.nativeElement;
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
      this.checkScrollButtonsMobile();
    }, 300);
  }

  checkScrollButtonsMobile(): void {
    const container = this.categoriesContainerMobile?.nativeElement;
    if (!container) return;

    this.canScrollLeftMobile = container.scrollLeft > 0;
    this.canScrollRightMobile = container.scrollLeft < (container.scrollWidth - container.clientWidth - 1);
  }
}

