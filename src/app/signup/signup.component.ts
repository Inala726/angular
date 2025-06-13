import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { ApiResponse, SignUpRequest } from '../baseUrl';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  apiMessage = '';
  apiMessageClass = '';
  isFormSubmitted = false;
  isFormValid = false;
  submissionAttempts = 0;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        this.noWhitespaceValidator
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.emailDomainValidator
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit() {
    this.signupForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });

    this.signupForm.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
      console.log('Form valid:', this.signupForm.valid);
      console.log('Form errors:', this.getFormErrors());
    });
  }

  noWhitespaceValidator(control: AbstractControl) {
    const value = control.value;
    if (value && value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  emailDomainValidator(control: AbstractControl) {
    const value = control.value;
    if (value && value.includes('@')) {
      const domain = value.split('@')[1];
      const allowed = ['gmail.com','yahoo.com','hotmail.com','outlook.com'];
      // if (!allowed.includes(domain)) return { invalidDomain: true };
    }
    return null;
  }

  getFieldErrors(fieldName: string): string[] {
    const control = this.signupForm.get(fieldName);
    const errors: string[] = [];
    if (control && control.errors && (control.touched || this.isFormSubmitted)) {
      Object.keys(control.errors).forEach(key => {
        errors.push(this.getErrorMessage(fieldName, key, control.errors![key]));
      });
    }
    return errors;
  }

  private getErrorMessage(field: string, key: string, val: any): string {
    const nameMap: Record<string,string> = {
      firstName:'First name', lastName:'Last name', email:'Email', password:'Password'
    };
    const display = nameMap[field] || field;
    switch(key) {
      case 'required':    return `${display} is required`;
      case 'minlength':   return `${display} must be at least ${val.requiredLength} characters`;
      case 'maxlength':   return `${display} must not exceed ${val.requiredLength} characters`;
      case 'email':       return 'Please enter a valid email address';
      case 'whitespace':  return `${display} cannot be just spaces`;
      case 'invalidDomain': return 'Please use a supported email provider';
      default:            return `${display} is invalid`;
    }
  }

  get firstNameErrors() { return this.getFieldErrors('firstName'); }
  get lastNameErrors()  { return this.getFieldErrors('lastName'); }
  get emailErrors()     { return this.getFieldErrors('email'); }
  get passwordErrors()  { return this.getFieldErrors('password'); }

  onSubmit() {
    this.isFormSubmitted = true;
    this.submissionAttempts++;
    this.markAllFieldsAsTouched();

    if (this.signupForm.invalid) {
      this.showApiMessage('Please fix the form errors below', 'error');
      return;
    }

    this.loading = true;
    this.apiMessage = '';

    const formData: SignUpRequest = {
      ...this.signupForm.value,
      role: 'USER'
    };

    this.authService.userSignUp(formData).subscribe({
      next: (resp: ApiResponse) => {
        this.loading = false;
        if (!resp.error) {
          this.showApiMessage(resp.message, 'success');
          this.resetFormState();
          setTimeout(() => {
            // === FIX: use queryParams instead of state ===
            this.router.navigate(['/verify-email'], {
              queryParams: { email: formData.email }
            });
          }, 1500);
        } else {
          this.showApiMessage(resp.message, 'error');
        }
      },
      error: (err) => {
        this.loading = false;
        this.showApiMessage(err.message || 'Registration failed. Please try again.', 'error');
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.values(this.signupForm.controls)
          .forEach(ctrl => ctrl.markAsTouched());
  }

  private resetFormState() {
    this.isFormSubmitted = false;
    this.submissionAttempts = 0;
    this.signupForm.reset();
    this.apiMessage = '';
    this.apiMessageClass = '';
  }

  private showApiMessage(msg: string, type: 'success'|'error') {
    this.apiMessage = msg;
    this.apiMessageClass = type;
    setTimeout(() => {
      this.apiMessage = '';
      this.apiMessageClass = '';
    }, 5000);
  }

  getFormErrors(): any {
    const e: Record<string,any> = {};
    Object.keys(this.signupForm.controls).forEach(k => {
      const c = this.signupForm.get(k);
      if (c?.errors) e[k] = c.errors;
    });
    return e;
  }

  canSubmit(): boolean {
    return this.signupForm.valid && !this.loading;
  }

  getSubmissionStatus(): string {
    if (this.loading) return 'Submitting…';
    if (this.isFormSubmitted && this.signupForm.valid)   return 'Form submitted successfully!';
    if (this.isFormSubmitted && this.signupForm.invalid) return 'Form has errors';
    return 'Ready to submit';
  }
}
