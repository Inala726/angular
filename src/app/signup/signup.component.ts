import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiResponse, SignUpRequest } from '../baseUrl';
import { CommonModule } from '@angular/common';

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
  
  // Form state tracking
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
        Validators.minLength(8),
        // this.strongPasswordValidator
      ]]
    });
  }

  ngOnInit() {
    // Track form validity changes
    this.signupForm.statusChanges.subscribe(status => {
      this.isFormValid = status === 'VALID';
    });

    // Log form changes for debugging
    this.signupForm.valueChanges.subscribe(values => {
      console.log('Form values changed:', values);
      console.log('Form valid:', this.signupForm.valid);
      console.log('Form errors:', this.getFormErrors());
    });
  }

  // Custom Validators
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
      const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      // Optional: restrict to certain domains
      // if (!allowedDomains.includes(domain)) {
      //   return { invalidDomain: true };
      // }
    }
    return null;
  }

  // strongPasswordValidator(control: AbstractControl) {
  //   const value = control.value;
  //   if (!value) return null;

  //   const hasUpperCase = /[A-Z]/.test(value);
  //   const hasLowerCase = /[a-z]/.test(value);
  //   const hasNumeric = /[0-9]/.test(value);
  //   const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

  //   const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

  //   if (!passwordValid) {
  //     return {
  //       strongPassword: {
  //         hasUpperCase,
  //         hasLowerCase,
  //         hasNumeric,
  //         hasSpecial
  //       }
  //     };
  //   }
  //   return null;
  // }

  // Improved error message getters
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

  private getErrorMessage(fieldName: string, errorKey: string, errorValue: any): string {
    const fieldDisplayName = this.getFieldDisplayName(fieldName);
    
    switch (errorKey) {
      case 'required':
        return `${fieldDisplayName} is required`;
      case 'minlength':
        return `${fieldDisplayName} must be at least ${errorValue.requiredLength} characters`;
      case 'maxlength':
        return `${fieldDisplayName} must not exceed ${errorValue.requiredLength} characters`;
      case 'email':
        return 'Please enter a valid email address';
      case 'whitespace':
        return `${fieldDisplayName} cannot be empty or contain only spaces`;
      case 'invalidDomain':
        return 'Please use a valid email provider';
      // case 'strongPassword':
      //   const missing = [];
      //   if (!errorValue.hasUpperCase) missing.push('uppercase letter');
      //   if (!errorValue.hasLowerCase) missing.push('lowercase letter');
      //   if (!errorValue.hasNumeric) missing.push('number');
      //   if (!errorValue.hasSpecial) missing.push('special character');
      //   return `Password must contain: ${missing.join(', ')}`;
      default:
        return `${fieldDisplayName} is invalid`;
    }
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  // Helper properties for template
  get firstNameErrors() { return this.getFieldErrors('firstName'); }
  get lastNameErrors() { return this.getFieldErrors('lastName'); }
  get emailErrors() { return this.getFieldErrors('email'); }
  get passwordErrors() { return this.getFieldErrors('password'); }

  // Form submission tracking
  onSubmit() {
    this.isFormSubmitted = true;
    this.submissionAttempts++;
    
    console.log('=== FORM SUBMISSION ATTEMPT ===');
    console.log('Attempt #:', this.submissionAttempts);
    console.log('Form Valid:', this.signupForm.valid);
    console.log('Form Values:', this.signupForm.value);
    console.log('Form Errors:', this.getFormErrors());
    
    // Mark all fields as touched to show errors
    this.markAllFieldsAsTouched();

    if (this.signupForm.invalid) {
      this.showApiMessage('Please fix the form errors below', 'error');
      console.log('❌ Form submission failed - validation errors');
      return;
    }

    this.loading = true;
    this.apiMessage = '';

    const formData: SignUpRequest = {
      ...this.signupForm.value,
      role: 'USER'
    };

    console.log('✅ Form is valid, sending to API...');
    console.log('Payload:', formData);

    this.authService.userSignUp(formData).subscribe({
      next: (response: ApiResponse) => {
        this.loading = false;
        console.log('🎉 API Response:', response);
        
        if (!response.error) {
          this.showApiMessage(response.message, 'success');
          console.log('✅ Registration successful!');
          
          // Reset form state
          this.resetFormState();
          
          setTimeout(() => {
            console.log('🔄 Redirecting to verification page...');
            this.router.navigate(['/verify-email'], {
              state: { email: formData.email }
            });
          }, 1500);
        } else {
          this.showApiMessage(response.message, 'error');
          console.log('❌ Registration failed:', response.message);
        }
      },
      error: (error) => {
        this.loading = false;
        const message = error.message || 'Registration failed. Please try again.';
        this.showApiMessage(message, 'error');
        console.log('💥 API Error:', error);
      }
    });
  }

  private markAllFieldsAsTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      this.signupForm.get(key)?.markAsTouched();
    });
  }

  private resetFormState() {
    this.isFormSubmitted = false;
    this.submissionAttempts = 0;
    this.signupForm.reset();
    this.apiMessage = '';
  }

  private showApiMessage(message: string, type: 'success' | 'error') {
    this.apiMessage = message;
    this.apiMessageClass = type;
    setTimeout(() => {
      this.apiMessage = '';
      this.apiMessageClass = '';
    }, 5000);
  }

  // Debug helper
  getFormErrors(): any {
    let errors: any = {};
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Method to check if form can be submitted
  canSubmit(): boolean {
    return this.signupForm.valid && !this.loading;
  }

  // Method to get form submission status
  getSubmissionStatus(): string {
    if (this.loading) return 'Submitting...';
    if (this.isFormSubmitted && this.signupForm.valid) return 'Form submitted successfully!';
    if (this.isFormSubmitted && this.signupForm.invalid) return 'Form has errors';
    return 'Ready to submit';
  }
}