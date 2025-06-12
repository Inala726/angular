// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiResponse, AUTH_URL, SignUpRequest } from '../baseUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupUrl = `${AUTH_URL}/sign-up`;
  private verifyOtpUrl = `${AUTH_URL}/verify-otp`;
  private resendOtpUrl = `${AUTH_URL}/resend-otp`;

  constructor(private http: HttpClient) {}

  userSignUp(data: SignUpRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.signupUrl, data).pipe(
      tap(res => console.log('Registration successful:', res)),
      catchError(this.handleError)
    );
  }

  verifyOtp(payload: { email: string; code: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.verifyOtpUrl, payload).pipe(
      tap(res => console.log('OTP verification:', res)),
      catchError(this.handleError)
    );
  }

  /** New: Resend the OTP email */
  resendOtp(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.resendOtpUrl, { email }).pipe(
      tap(res => console.log('Resend OTP response:', res)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    let message = 'An unknown error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      message = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 401:
          message = 'Unauthorized. Please check your credentials.';
          break;
        case 409:
          message = 'Conflict. Resource already exists.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    }
    return throwError(() => new Error(message));
  }
}
