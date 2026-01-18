import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from "@angular/forms";
import {
  NgbOffcanvas,
  NgbOffcanvasModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { Tab, Product, Category, OrderItem } from "../../../models";
import { OrdersService } from "../../../services/orders.service";
import { ProductsService } from "../../../services/products.service";
import { CategoriesService } from "../../../services/categories.service";
import { NotificationService } from "../../../services/notification.service";
import { ReceiptComponent } from "../../../components/receipt/receipt.component";
import { LucideAngularModule, Plus, Trash2 } from "lucide-angular";
import Swal from "sweetalert2";
import { NgxMaskDirective } from "ngx-mask";

@Component({
  selector: "app-customer-tab-list",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReceiptComponent,
    NgbOffcanvasModule,
    LucideAngularModule,
    NgbTooltipModule,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: "./customer-tab-list.component.html",
  styleUrls: ["./customer-tab-list.component.scss"],
})
export class CustomerTabListComponent implements OnInit, AfterViewInit {
  openedTabs: Tab[] = [];
  closedTabs: Tab[] = [];
  showClosedTabs = false;
  maxItemsToShow = 3; // Limite de itens a mostrar

  // FAB Menu
  fabExpanded = false;

  // Icons
  Plus = Plus;
  Trash2 = Trash2;

  // Detalhes da comanda
  selectedTab: Tab | null = null;

  // Adicionar itens
  showAddItemsModal = false;
  addItemsForm!: FormGroup;
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory = "";
  cartItems: any[] = [];
  cartTotal = 0;

  // Recibo
  selectedTabForReceipt: Tab | null = null;

  // Scroll controls for mobile categories
  canScrollLeftMobile = false;
  canScrollRightMobile = false;

  @ViewChild("orderDetailOffcanvas") orderDetailOffcanvas!: TemplateRef<any>;
  @ViewChild("addItemsOffcanvas") addItemsOffcanvas!: TemplateRef<any>;
  @ViewChild("categoriesContainerMobile")
  categoriesContainerMobile!: ElementRef;

  isLoadingTabs = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private notificationService: NotificationService,
    private offcanvasService: NgbOffcanvas,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.refreshTabs();
    this.loadTabs();
    this.loadProducts();
    this.loadCategories();
    this.initAddItemsForm();

    this.ordersService.loading$.subscribe((loading) => {
      this.isLoadingTabs = loading;
      this.cdr.detectChanges();
    });
  }

  refreshTabs(): void {
    this.ordersService.loadTabs();
  }

  initAddItemsForm(): void {
    this.addItemsForm = this.fb.group({});
  }

  loadTabs(): void {
    this.ordersService.getTabs().subscribe((tabs) => {
      this.openedTabs = tabs;
    });

    // Load closed tabs separately using the status-filtered query
    this.ordersService.getClosedTabs().subscribe((tabs) => {
      this.closedTabs = tabs || [];
    });
  }

  loadProducts(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products = products?.filter((p) => p.active);
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

  getDisplayItems(tab: Tab): any[] {
    const normalize = (id?: string) =>
      (id || "").replace(/-/g, "").toLowerCase();
    return tab.orders
      .map((order) => order?.products)
      .map((products) =>
        products?.map((item) => ({
          ...item,
          isPricePerKg: this.products.find((p) => normalize(p.id) === normalize(item.product_id))
            ?.isPricePerKg,
        }))
      )
      .flat()
      .slice(0, this.maxItemsToShow);
  }

  hasMoreItems(tab: Tab): boolean {
    return (
      tab.orders.map((order) => order?.products).flat()?.length >
      this.maxItemsToShow
    );
  }

  getRemainingItemsCount(tab: Tab): number {
    return (
      tab.orders.map((order) => order?.products).flat()?.length -
      this.maxItemsToShow
    );
  }

  openTab(tab: Tab): void {
    this.selectedTab = tab;

    // Use offcanvas em mobile/tablet, modal em desktop
    if (window.innerWidth < 1024) {
      this.offcanvasService.open(this.orderDetailOffcanvas, {
        position: "bottom",
        panelClass: "offcanvas-bottom-full",
      });
    }
  }

  closeOrderDetail(): void {
    this.selectedTab = null;
    this.offcanvasService.dismiss();
  }

  toggleFab(): void {
    this.fabExpanded = !this.fabExpanded;
  }

  createNewComanda(): void {
    this.fabExpanded = false; // Close FAB menu
    this.router.navigate(["/customer-tabs/nova"]);
  }

  createNewPedido(): void {
    this.fabExpanded = false; // Close FAB menu
    this.router.navigate(["/customer-tabs/novo-pedido"]);
  }

  // Adicionar Itens
  openAddItemsModal(tab: Tab, event: Event): void {
    event.stopPropagation();
    this.selectedTab = tab;
    this.showAddItemsModal = true;
    this.cartItems = [];
    this.cartTotal = 0;
    this.selectedCategory = "";

    // Fechar offcanvas de detalhes se estiver aberto
    this.offcanvasService.dismiss();

    // Use offcanvas em mobile/tablet, modal em desktop
    if (window.innerWidth < 1024) {
      this.offcanvasService.open(this.addItemsOffcanvas, {
        position: "bottom",
        panelClass: "offcanvas-bottom-full",
      });
    }
  }

  closeAddItemsModal(): void {
    this.selectedTab = null;
    this.showAddItemsModal = false;
    this.cartItems = [];
    this.cartTotal = 0;
    this.offcanvasService.dismiss();
  }

  getFilteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    if (!this.products) {
      return [];
    }
    const normalize = (id?: string) =>
      (id || "").replace(/-/g, "").toLowerCase();
    return this.products.filter(
      (p) => normalize(p.category_id) === normalize(this.selectedCategory)
    );
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find(
      (item) => item.product_id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.cartItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: 1,
        unit_price: product.price,
        isPricePerKg: product.isPricePerKg
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
      this.cartItems = this.cartItems?.filter((i) => i !== item);
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
    const productElement = document.querySelector(
      `[data-product-id="${productId}"]`
    );
    if (productElement) {
      productElement.classList.add("product-added-animation");
      setTimeout(() => {
        productElement.classList.remove("product-added-animation");
      }, 600);
    }
  }

  submitAddItems(): void {
    if (!this.selectedTab || this.cartItems.length === 0) {
      return;
    }

    this.ordersService
      .createOrderWithProducts(
        this.selectedTab.id,
        this.cartItems?.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        }))
      )
      .subscribe({
        next: (orderId) => {
          this.refreshTabs();
        },
        error: (err) => {
          console.error("Error adding items to order:", err);
          this.notificationService.error("Erro ao adicionar itens à comanda");
        },
      });

    this.notificationService.success("Itens adicionados com sucesso!");
    this.closeAddItemsModal();
  }

  // Fechar Comanda
  closeTabAction(tab: Tab, event: Event): void {
    event.stopPropagation();
    this.selectedTabForReceipt = tab;
  }

  onReceiptClose(): void {
    this.selectedTabForReceipt = null;
    this.refreshTabs();
  }

  // Finalizar Comanda (chamado pelo Receipt component)
  finalizeOrder(event: { orderId: string; paymentMethod: string }): void {
    // Use the closeCustomerTab mutation to close the tab
    this.ordersService.closeCustomerTab(event.orderId).subscribe({
      next: (success) => {
        if (success) {
          this.notificationService.success("Comanda fechada com sucesso!");
          this.selectedTabForReceipt = null;
          this.refreshTabs();
        } else {
          this.notificationService.error("Erro ao fechar comanda");
        }
      },
      error: (err) => {
        console.error("Error closing customer tab:", err);
        this.notificationService.error("Erro ao fechar comanda");
      },
    });
  }

  ngAfterViewInit(): void {
    // Check scroll state after view init
    setTimeout(() => {
      this.checkScrollButtonsMobile();
    }, 100);
  }

  scrollCategoriesMobile(direction: "left" | "right"): void {
    const container = this.categoriesContainerMobile?.nativeElement;
    if (!container) return;

    const scrollAmount = 200;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
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
    this.canScrollRightMobile =
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
  }

  onReceiptSendEmail(): void {
    if (!this.selectedTabForReceipt) {
      return;
    }

    Swal.fire({
      title: "Preencha o e-mail do cliente",
      input: "email",
      inputPlaceholder: "Digite o e-mail do cliente",
      showCancelButton: true,
      confirmButtonColor: "#1d2d44",
      confirmButtonText: "Enviar E-mail",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const email = result.value;
        if (!email) {
          return;
        }

        this.ordersService
          .sendCustomerTabEmail(this.selectedTabForReceipt?.id || "", email)
          .subscribe({
            next: (success) => {
              if (success) {
                this.notificationService.success("E-mail enviado com sucesso!");
              } else {
                this.notificationService.error("Erro ao enviar e-mail");
              }
            },
            error: (err) => {
              console.error("Error sending email:", err);
              this.notificationService.error("Erro ao enviar e-mail");
            },
          });
      }
    });
  }

  updateWeight(item: OrderItem, weight: string): void {
    const cleanedWeight = String(weight).replace(",", ".");
    const weightValue = parseFloat(cleanedWeight);
    item.quantity = weightValue || 0;
    this.updateCartTotal();
  }

  deleteComanda(tab: Tab, event: Event): void {
    event.stopPropagation();

    Swal.fire({
      title: "Excluir Comanda?",
      text: `Tem certeza que deseja excluir a comanda de ${tab.customer_name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordersService.deleteCustomerTab(tab.id).subscribe({
          next: (success) => {
            if (success) {
              this.notificationService.success("Comanda excluída com sucesso!");
              this.refreshTabs();
            } else {
              this.notificationService.error("Erro ao excluir comanda");
            }
          },
          error: (err) => {
            console.error("Error deleting comanda:", err);
            this.notificationService.error("Erro ao excluir comanda");
          },
        });
      }
    });
  }

  deleteOrder(orderId: string, event: Event): void {
    event.stopPropagation();

    Swal.fire({
      title: "Excluir Pedido?",
      text: "Tem certeza que deseja excluir este pedido?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ordersService.deleteOrder(orderId).subscribe({
          next: (success) => {
            if (success) {
              this.notificationService.success("Pedido excluído com sucesso!");
              this.refreshTabs();
            } else {
              this.notificationService.error("Erro ao excluir pedido");
            }
          },
          error: (err) => {
            console.error("Error deleting order:", err);
            this.notificationService.error("Erro ao excluir pedido");
          },
        });
      }
    });
  }
}
