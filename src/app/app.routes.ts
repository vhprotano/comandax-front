import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ManagerDashboardComponent } from './pages/manager/dashboard/dashboard.component';
import { WaiterDashboardComponent } from './pages/waiter/dashboard/dashboard.component';
import { KitchenDashboardComponent } from './pages/kitchen/dashboard/dashboard.component';
import { OrderFormComponent } from './pages/waiter/order-form/order-form.component';
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
    path: 'manager',
    component: ManagerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['MANAGER'] },
  },
  {
    path: 'waiter',
    component: WaiterDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WAITER'] },
  },
  {
    path: 'waiter/new',
    component: OrderFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WAITER'] },
  },
  {
    path: 'waiter/edit/:id',
    component: OrderFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['WAITER'] },
  },
  {
    path: 'kitchen',
    component: KitchenDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['KITCHEN'] },
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

