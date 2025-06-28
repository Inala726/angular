// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  UserProfile,
} from '../types';
import { AUTH_URL, BASE_URL } from '../baseUrl';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private signupUrl    = `${AUTH_URL}/sign-up`;
  private loginUrl     = `${AUTH_URL}/login`;
  private verifyOtpUrl = `${AUTH_URL}/verify-email`;
  private resendOtpUrl = `${AUTH_URL}/resend-otp`;
  private profileUrl   = `${BASE_URL}/users/me`;

  constructor(private http: HttpClient, private router: Router) {}

  /** Both user & admin call the same sign-up endpoint; you just pass role: 'ADMIN' */
  signUp(data: SignUpRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.signupUrl, data).pipe(
      tap(res => console.log('Sign-up response:', res)),
      catchError(this.handleError)
    );
  }

  /** Login */
  signIn(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, data).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      }),
      catchError(this.handleError)
    );
  }

  /** Send or resend OTP (shared for user & admin) */
  sendOtp(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.resendOtpUrl, { email }).pipe(
      tap(res => console.log('OTP sent:', res)),
      catchError(this.handleError)
    );
  }

  /** Verify OTP (shared) */
  verifyOtp(payload: { email: string; otp: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.verifyOtpUrl, payload).pipe(
      tap(res => console.log('OTP verified:', res)),
      catchError(this.handleError)
    );
  }

  /** Logout */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/signin']);
  }

  /** Fetch current user profile */
  getProfile(): Observable<UserProfile['data']> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`
    });
    return this.http
      .get<UserProfile>(this.profileUrl, { headers })
      .pipe(
        map(resp => resp.data),
        catchError(this.handleError)
      );
  }

  resendOtp(email: string): Observable<ApiResponse> {
    return this.http
      .post<ApiResponse>(this.resendOtpUrl, { email })
      .pipe(
        tap(res => console.log('OTP resent:', res)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    let message = 'An unknown error occurred.';
    let validationErrors: any[] = [];

    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    } else {
      switch (error.status) {
        case 400:
          message = 'Invalid request.';
          validationErrors = Array.isArray(error.error)
            ? error.error
            : error.error.errors || [];
          break;
        case 401:
          message = 'Unauthorized. Please check your credentials.';
          break;
        case 409:
          message = 'Conflict. Resource already exists.';
          break;
        case 422:
          message = 'Validation failed.';
          validationErrors = error.error.errors || [];
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    }

    return throwError(() => ({
      message,
      status: error.status,
      validationErrors
    }));
  }
}
