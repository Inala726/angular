import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiResponse, SignUpRequest } from '../types';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-admin-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.scss'],
})
export class AdminSignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  isFormSubmitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            this.noWhitespaceValidator,
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            this.noWhitespaceValidator,
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email, this.adminEmailValidator],
        ],
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.strongPasswordValidator],
        ],
        confirmPassword: ['', [Validators.required]],
        // invitationCode removed
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit() {}

  // Custom validators
  noWhitespaceValidator(control: AbstractControl) {
    const val = control.value as string;
    return val && !val.trim().length ? { whitespace: true } : null;
  }

  adminEmailValidator(control: AbstractControl) {
    const val = control.value as string;
    if (val && val.includes('@')) {
      const domain = val.split('@')[1];
      const allowed = ['company.com', 'admin.org', 'gmail.com'];
      return allowed.includes(domain) ? null : { invalidDomain: true };
    }
    return null;
  }

  strongPasswordValidator(control: AbstractControl) {
    const val = control.value as string;
    if (!val) return null;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNum = /[0-9]/.test(val);
    const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(val);
    return hasUpper && hasLower && hasNum && hasSpec ? null : { weakPassword: true };
  }

  passwordMatchValidator(fg: FormGroup) {
    return fg.get('password')!.value === fg.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  // Error messages
  getFieldErrors(field: string): string[] {
    const ctrl = this.signupForm.get(field)!;
    const errs: string[] = [];
    if ((ctrl.touched || this.isFormSubmitted) && ctrl.errors) {
      for (const key of Object.keys(ctrl.errors!)) {
        switch (key) {
          case 'required':
            errs.push(`${this.labelFor(field)} is required`);
            break;
          case 'minlength':
            errs.push(
              `${this.labelFor(field)} must be at least ${
                ctrl.errors!['minlength'].requiredLength
              } characters`
            );
            break;
          case 'maxlength':
            errs.push(
              `${this.labelFor(field)} must not exceed ${
                ctrl.errors!['maxlength'].requiredLength
              } characters`
            );
            break;
          case 'email':
            errs.push(`Enter a valid email`);
            break;
          case 'invalidDomain':
            errs.push(`Must use a company/admin email`);
            break;
          case 'weakPassword':
            errs.push(`Include upper, lower, number & special char`);
            break;
          case 'whitespace':
            errs.push(`Cannot be only spaces`);
            break;
        }
      }
    }
    if (field === 'confirmPassword' && this.signupForm.errors?.['mismatch']) {
      errs.push(`Passwords do not match`);
    }
    return errs;
  }

  private labelFor(field: string) {
    const map: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
    };
    return map[field] || field;
  }

  canSubmit(): boolean {
    return this.signupForm.valid && !this.loading;
  }

  onSubmit() {
    this.isFormSubmitted = true;
    if (this.signupForm.invalid) {
      this.toast.show('Please fix form errors', 'error');
      return;
    }
    this.loading = true;
    const { firstName, lastName, email, password } = this.signupForm.value;
    const payload: SignUpRequest = { firstName, lastName, email, password, role: 'ADMIN' };
    this.authService.signUp(payload).subscribe({
      next: (res: ApiResponse) => {
        this.loading = false;
        if (!res.error) {
          this.toast.show('An OTP was sent successfully to your email', 'success');
          this.router.navigate(['/verify-email'], {
  queryParams: { email: email, role: 'ADMIN' }
});
          this.router.navigate(['/verify-email']);
        } else {
          this.toast.show(res.message, 'error');
        }
      },
      error: err => {
        this.loading = false;
        this.toast.show(err.message || 'Registration failed', 'error');
      },
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') this.showPassword = !this.showPassword;
    else this.showConfirmPassword = !this.showConfirmPassword;
  }
}
