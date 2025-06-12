import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  otpForm!: FormGroup;
  apiError = '';
  loading = false;
  email = '';
  resendLoading = false;
  resendMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    this.email = (nav?.extras.state as any)?.email || '';

    this.otpForm = this.fb.group({
      code0: ['', [Validators.required, Validators.maxLength(1)]],
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  get code() {
    const v = this.otpForm.value;
    return `${v.code0}${v.code1}${v.code2}${v.code3}${v.code4}${v.code5}`;
  }

  onSubmit() {
    if (this.otpForm.invalid) return;
    this.loading = true;
    this.apiError = '';

    this.auth.verifyOtp({ email: this.email, code: this.code })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: err => {
          this.loading = false;
          this.apiError = err.message;
        }
      });
  }

  /** New: resend the OTP */
  onResend() {
    this.resendLoading = true;
    this.resendMessage = '';
    this.auth.resendOtp(this.email).subscribe({
      next: res => {
        this.resendLoading = false;
        this.resendMessage = res.message || 'OTP resent successfully.';
      },
      error: err => {
        this.resendLoading = false;
        this.resendMessage = err.message || 'Failed to resend OTP.';
      }
    });
  }
}
