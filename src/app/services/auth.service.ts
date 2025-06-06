import { Injectable } from '@angular/core';
import { ApiResponse, AUTH_URL, SignUpRequest } from '../baseUrl';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private url = `${AUTH_URL}/sign-up`
  constructor(private http:HttpClient) { }

  userSignUp(data:SignUpRequest): Observable<ApiResponse>{
    return this.http
  .post<ApiResponse>(this.url, data)
  .pipe(
    tap((response: ApiResponse) => {
      console.log('registration successful', response);
    }),
      catchError(this.handleRegistrationError)
    );
  }

  private handleRegistrationError(error: HttpErrorResponse): Observable<never> {
    console.error('Registration failed:', error);

    // Customize error message based on status code or backend response
    let message = 'An unknown error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          message = 'Invalid request. Please check your input.';
          break;
        case 409:
          message = 'User already exists.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    }

    return throwError(() => new Error(message));
  }
}
