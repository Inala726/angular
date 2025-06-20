// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ApiResponse, LoginRequest, LoginResponse, SignUpRequest, UserProfile } from '../types';
import { AUTH_URL, BASE_URL } from '../baseUrl';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signupUrl = `${AUTH_URL}/sign-up`;
  private verifyOtpUrl = `${AUTH_URL}/verify-email`;
  private resendOtpUrl = `${AUTH_URL}/resend-otp`;
  private loginUrl = `${AUTH_URL}/login`;
  private profileUrl = `${BASE_URL}/users/me`

  constructor(private http: HttpClient, private router:Router) {}

  userSignUp(data: SignUpRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.signupUrl, data).pipe(
      tap(res => console.log('Registration successful:', res)),
      catchError(this.handleError)
    );
  }

  verifyOtp(payload: { email: string; otp: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.verifyOtpUrl, payload).pipe(
      tap(res => console.log('OTP verification:', res)),
      catchError(this.handleError)
    );
  }

  resendOtp(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.resendOtpUrl, { email }).pipe(
      tap(res => console.log('Resend OTP response:', res)),
      catchError(this.handleError)
    );
  }

  userSignIn(data:LoginRequest):Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.loginUrl, data).pipe(
      tap(res => {
        // store tokens in localStorage (or a more secure storage)
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      }),
      catchError(this.handleError)
    );
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  logout() {
    // 1. Remove tokens (or any other user data)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    // 2. Navigate back to sign‑in
    this.router.navigate(['/signin']);
  }

  getProfile(): Observable<UserProfile['data']> {
    return this.http
      .get<UserProfile>(this.profileUrl, { headers: this.authHeaders() })
      .pipe(
        map(response => response.data),
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
