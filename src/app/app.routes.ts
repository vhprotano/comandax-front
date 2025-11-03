import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'comandas',
        loadComponent: () =>
          import('./pages/comandas/comandas-list/comandas-list.component').then(
            (m) => m.ComandasListComponent
          ),
      },
      {
        path: 'comandas/nova',
        loadComponent: () =>
          import('./pages/comandas/nova-comanda/nova-comanda.component').then(
            (m) => m.NovaComandaComponent
          ),
      },
      {
        path: 'comandas/novo-pedido',
        loadComponent: () =>
          import('./pages/comandas/nova-comanda/nova-comanda.component').then(
            (m) => m.NovaComandaComponent
          ),
      },
      {
        path: 'produtos',
        loadComponent: () =>
          import('./pages/manager/products/products.component').then((m) => m.ProductsComponent),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./pages/manager/categories/categories.component').then(
            (m) => m.CategoriesComponent
          ),
      },
      {
        path: 'mesas',
        loadComponent: () =>
          import('./components/table-view/table-view.component').then((m) => m.TableViewComponent),
      },
      {
        path: 'dashboard',
        redirectTo: '/comandas',
        pathMatch: 'full',
      },
    ],
  },
  // {
  //   path: 'new-order',
  //   component: NewOrderComponent,
  //   canActivate: [authGuard],
  //   data: { isClosedOrder: false },
  // },
  // {
  //   path: 'new-closed-order',
  //   component: NewOrderComponent,
  //   canActivate: [authGuard],
  //   data: { isClosedOrder: true },
  // },
  // Rotas antigas mantidas para compatibilidade
  // {
  //   path: 'manager',
  //   component: ManagerDashboardComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['MANAGER'] },
  // },
  // {
  //   path: 'waiter',
  //   component: WaiterDashboardComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['WAITER'] },
  // },
  // {
  //   path: 'waiter/new',
  //   component: OrderFormComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['WAITER'] },
  // },
  // {
  //   path: 'waiter/edit/:id',
  //   component: OrderFormComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['WAITER'] },
  // },
  // {
  //   path: 'kitchen',
  //   component: KitchenDashboardComponent,
  //   canActivate: [authGuard, roleGuard],
  //   data: { roles: ['KITCHEN'] },
  // },
  {
    path: '**',
    redirectTo: '/login',
  },
];

