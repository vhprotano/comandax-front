import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  selectedRole: 'MANAGER' | 'WAITER' | 'KITCHEN' = 'MANAGER';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.error = 'Por favor, preencha todos os campos corretamente';
      return;
    }

    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password, this.selectedRole).subscribe({
      next: (user) => {
        this.loading = false;
        // Redirecionar baseado no role
        if (user.role === 'MANAGER') {
          this.router.navigate(['/manager']);
        } else if (user.role === 'WAITER') {
          this.router.navigate(['/waiter']);
        } else if (user.role === 'KITCHEN') {
          this.router.navigate(['/kitchen']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Erro ao fazer login. Verifique suas credenciais.';
        console.error(err);
      },
    });
  }

  setRole(role: 'MANAGER' | 'WAITER' | 'KITCHEN'): void {
    this.selectedRole = role;
  }
}

