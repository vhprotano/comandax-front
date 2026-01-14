import { Component, OnInit } from "@angular/core";
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
} from "lucide-angular";

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  disabled?: boolean;
  tooltip?: string;
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
export class MainLayoutComponent implements OnInit {
  sidebarCollapsed = false;

  // Lucide icons
  readonly Menu = Menu;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  menuItems: MenuItem[] = [
    {
      id: "comandas",
      label: "Comandas",
      icon: "📋",
      route: "/customer-tabs",
    },
    {
      id: "cozinha",
      label: "Cozinha",
      icon: "👨‍🍳",
      disabled: true,
      tooltip: "Em Breve",
    },
    {
      id: "separator",
      label: "",
      icon: "",
    },
    {
      id: "gestao",
      label: "Gestão",
      icon: "⚙️",
      children: [
        {
          id: "produtos",
          label: "Produtos",
          icon: "🍽️",
          route: "/produtos",
        },
        {
          id: "categorias",
          label: "Categorias",
          icon: "📂",
          route: "/categorias",
        },
        {
          id: "mesas",
          label: "Mesas",
          icon: "🪑",
          route: "/mesas",
        },
      ],
    },
    {
      id: "relatorios",
      label: "Relatórios",
      icon: "📈",
      route: "/relatorios",
    },
    {
      id: "ajuda",
      label: "Ajuda",
      icon: "❓",
      route: "https://wa.me/5543999721068",
    },
  ];

  expandedMenus = new Set<string>();
  isMobile = false;
  isOffcanvasOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private offcanvasService: NgbOffcanvas
  ) {}

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener("resize", () => this.checkMobile());
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

  navigate(route: string): void {
    if (route.startsWith('http')) {
      // External URL (like WhatsApp)
      window.open(route, '_blank');
    } else {
      // Internal route
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
