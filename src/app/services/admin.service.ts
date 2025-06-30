import { Injectable } from '@angular/core';
import { BASE_URL } from '../baseUrl';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import {
  Alert,
  AlertsResponse,
  Device,
  ListDevicesResponse,
  ListUserResponse,
  User,
} from '../types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private alertsURL = `${BASE_URL}/alerts`;
  private devicesURL = `${BASE_URL}/devices`;
  private usersURL = `${BASE_URL}/users`;
  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Admin: fetch all alerts */
  getAllAlerts(): Observable<Alert[]> {
    return this.http
      .get<AlertsResponse>(this.alertsURL, { headers: this.authHeaders() })
      .pipe(
        map((res) => res.data),
        catchError(this.handleError)
      );
  }

  /** Admin: fetch all devices */
  getAllDevices(): Observable<Device[]> {
    return this.http
      .get<ListDevicesResponse>(this.devicesURL, {
        headers: this.authHeaders(),
      })
      .pipe(map((res) => res.data, catchError(this.handleError)));
  }

  /** Admin: fetch all users */
  getAllUsers(): Observable<User[]> {
    return this.http
      .get<ListUserResponse>(this.usersURL, { headers: this.authHeaders() })
      .pipe(
        map((res) => res.data),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AdminService Error:', error);
    let message = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      // Client‑side or network error
      message = `Network error: ${error.error.message}`;
    } else {
      // Backend error
      switch (error.status) {
        case 401:
          message = 'Unauthorized. Please log in again.';
          break;
        case 403:
          message = 'Forbidden. You do not have permission.';
          break;
        case 404:
          message = 'not found.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.error?.message || message;
      }
    }

    return throwError(() => new Error(message));
  }
}
