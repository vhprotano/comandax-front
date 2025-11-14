import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { MainLayoutComponent } from "./layouts/main-layout/main-layout.component";
import { authGuard } from "./guards/auth.guard";
import { roleGuard } from "./guards/role.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "customer-tabs",
        loadComponent: () =>
          import(
            "./pages/customer-tabs/customer-tab-list/customer-tab-list.component"
          ).then((m) => m.CustomerTabListComponent),
      },
      {
        path: "customer-tabs/nova",
        loadComponent: () =>
          import(
            "./pages/customer-tabs/new-customer-tab/new-customer-tab.component"
          ).then((m) => m.NewCustomerTabComponent),
      },
      {
        path: "customer-tabs/novo-pedido",
        loadComponent: () =>
          import(
            "./pages/customer-tabs/new-customer-tab/new-customer-tab.component"
          ).then((m) => m.NewCustomerTabComponent),
      },
      {
        path: "produtos",
        loadComponent: () =>
          import("./pages/manager/products/products.component").then(
            (m) => m.ProductsComponent
          ),
      },
      {
        path: "categorias",
        loadComponent: () =>
          import("./pages/manager/categories/categories.component").then(
            (m) => m.CategoriesComponent
          ),
      },
      {
        path: "mesas",
        loadComponent: () =>
          import("./pages/manager/table-view/table-view.component").then(
            (m) => m.TableViewComponent
          ),
      },
      {
        path: "relatorios",
        loadComponent: () =>
          import(
            "./components/statistics-dashboard/statistics-dashboard.component"
          ).then((m) => m.StatisticsDashboardComponent),
      },
      {
        path: "dashboard",
        redirectTo: "/customer-tabs",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "**",
    redirectTo: "/login",
  },
];
