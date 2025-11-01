import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService, Employee } from '../../../services/data.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  employeeForm!: FormGroup;
  showForm = false;
  editingId: string | null = null;

  roles = [
    { value: 'WAITER', label: '👨‍🍳 Garçom' },
    { value: 'KITCHEN', label: '👨‍🍳 Cozinha' },
    { value: 'MANAGER', label: '👔 Gerente' },
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadEmployees();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['WAITER', [Validators.required]],
      phone: [''],
    });
  }

  loadEmployees(): void {
    this.dataService.getEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }

  openForm(): void {
    this.showForm = true;
    this.editingId = null;
    this.employeeForm.reset({ role: 'WAITER' });
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.employeeForm.reset();
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.notificationService.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const formValue = this.employeeForm.value;

    if (this.editingId) {
      this.dataService.updateEmployee(this.editingId, formValue);
      this.notificationService.success('Funcionário atualizado com sucesso!');
    } else {
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formValue,
        active: true,
        created_at: new Date(),
      };
      this.dataService.addEmployee(newEmployee);
      this.notificationService.success('Funcionário criado com sucesso!');
    }

    this.closeForm();
  }

  editEmployee(employee: Employee): void {
    this.editingId = employee.id;
    this.employeeForm.patchValue(employee);
    this.showForm = true;
  }

  deleteEmployee(id: string): void {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      this.dataService.deleteEmployee(id);
      this.notificationService.success('Funcionário deletado com sucesso!');
    }
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find((r) => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  toggleActive(employee: Employee): void {
    this.dataService.updateEmployee(employee.id, { active: !employee.active });
    const status = employee.active ? 'desativado' : 'ativado';
    this.notificationService.success(`Funcionário ${status} com sucesso!`);
  }
}

