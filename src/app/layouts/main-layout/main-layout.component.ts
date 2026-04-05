import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NgbOffcanvasModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbOffcanvas } from "@ng-bootstrap/ng-bootstrap";
import {
  LucideAngularModule,
  Menu,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  ChefHat,
  Package,
  FolderOpen,
  Armchair,
  BarChart3,
  HelpCircle,
  LogOut,
  Settings,
  X,
} from "lucide-angular";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  route?: string;
  children?: MenuItem[];
  disabled?: boolean;
  tooltip?: string;
  external?: boolean;
}

@Component({
  selector: "app-main-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgbOffcanvasModule,
    LucideAngularModule,
  ],
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sidebarCollapsed = false;

  // Lucide icons
  readonly Menu = Menu;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly ChevronDown = ChevronDown;
  readonly LogOut = LogOut;
  readonly X = X;

  menuItems: MenuItem[] = [
    {
      id: "comandas",
      label: "Comandas",
      icon: ClipboardList,
      route: "/customer-tabs",
    },
    {
      id: "cozinha",
      label: "Cozinha",
      icon: ChefHat,
      disabled: true,
      tooltip: "Em Breve",
    },
    {
      id: "separator",
      label: "",
      icon: null,
    },
    {
      id: "gestao",
      label: "Gestão",
      icon: Settings,
      children: [
        {
          id: "produtos",
          label: "Produtos",
          icon: Package,
          route: "/produtos",
        },
        {
          id: "categorias",
          label: "Categorias",
          icon: FolderOpen,
          route: "/categorias",
        },
        {
          id: "mesas",
          label: "Mesas",
          icon: Armchair,
          route: "/mesas",
        },
      ],
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: BarChart3,
      route: "/relatorios",
    },
    {
      id: "ajuda",
      label: "Ajuda",
      icon: HelpCircle,
      route: "https://wa.me/5543999721068",
      external: true,
    },
  ];

  expandedMenus = new Set<string>();
  isMobile = false;
  isOffcanvasOpen = false;
  private resizeListener: (() => void) | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    this.resizeListener = () => this.checkMobile();
    window.addEventListener("resize", this.resizeListener);
  }

  ngOnDestroy(): void {
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }
  }

  checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  toggleMenu(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  navigate(route: string, external?: boolean): void {
    if (external || route.startsWith("http")) {
      window.open(route, "_blank");
    } else {
      this.router.navigate([route]);
    }
    if (this.isMobile) {
      this.closeOffcanvas();
    }
  }

  openOffcanvas(content: any): void {
    this.offcanvasService.open(content, {
      position: "start",
      backdrop: true,
      keyboard: true,
      panelClass: "offcanvas-menu",
    });
  }

  closeOffcanvas(): void {
    this.offcanvasService.dismiss();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  isActiveRoute(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + "/");
  }
}
