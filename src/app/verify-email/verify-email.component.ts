import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  otpForm!: FormGroup;
  email = '';
  loading = false;
  apiError = '';
  resendLoading = false;
  resendMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute    // ← added
  ) {}
role: 'USER' | 'ADMIN' = 'USER'; // Default fallback

  ngOnInit() {
    // Read the email from query parameters (?email=...)
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.role = params['role'] === 'ADMIN' ? 'ADMIN' : 'USER';
    });

    this.otpForm = this.fb.group({
      code0: ['', [Validators.required, Validators.maxLength(1)]],
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  get code(): string {
    const v = this.otpForm.value;
    return `${v.code0}${v.code1}${v.code2}${v.code3}${v.code4}${v.code5}`;
  }

  autoFocus(
    currentInput: HTMLInputElement,
    nextInput: HTMLInputElement | null
  ) {
    if (currentInput.value && nextInput) {
      nextInput.focus();
    }
  }

  onSubmit() {
  if (this.otpForm.invalid) return;
  this.loading = true;
  this.apiError = '';

  this.auth.verifyOtp({ email: this.email, otp: this.code }).subscribe({
    next: () => {
      this.loading = false;
      const redirect = this.role === 'ADMIN' ? '/admin/login' : '/signin';
      this.router.navigate([redirect]);
    },
    error: err => {
      this.loading = false;
      this.apiError = err.message;
    }
  });
}


  onResend() {
    this.resendLoading = true;
    this.resendMessage = '';
    this.auth.resendOtp(this.email).subscribe({
      next: res => {
        this.resendLoading = false;
        this.resendMessage = res.message;
      },
      error: err => {
        this.resendLoading = false;
        this.resendMessage = err.message;
      }
    });
  }
}
