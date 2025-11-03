import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProductsComponent } from '../products/products.component';
import { CategoriesComponent } from '../categories/categories.component';
import { EmployeesComponent } from '../employees/employees.component';
import { OrderHistoryComponent } from '../../../components/order-history/order-history.component';
import { ActivityHistoryComponent } from '../../../components/activity-history/activity-history.component';
import { ModalComponent } from '../../../components/modal/modal.component';
import { ManagerOrdersComponent } from '../manager-orders/manager-orders.component';
import { TableViewComponent } from '../table-view/table-view.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductsComponent,
    CategoriesComponent,
    EmployeesComponent,
    TableViewComponent,
    // OrderHistoryComponent,
    ActivityHistoryComponent,
    ModalComponent,
    ManagerOrdersComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class ManagerDashboardComponent implements OnInit {
  activeTab = 'overview';
  userName = 'Gerente';
  showActivityModal = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user).name;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openActivityModal(): void {
    this.showActivityModal = true;
  }

  closeActivityModal(): void {
    this.showActivityModal = false;
  }
}

