import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Update path as needed
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../types';
import { ToastService } from '../services/toast.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@example.com', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const credentials: LoginRequest = this.loginForm.value;

    this.authService.signIn(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.accessToken) {
          this.toast.show('Login successful', 'success')
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.errorMessage = 'Login failed. Invalid credentials or admin privileges.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.toast.show(error.message, 'error');
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}