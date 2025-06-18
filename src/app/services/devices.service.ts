// src/app/services/devices.service.ts
import { Injectable } from '@angular/core';
import { DEVICES_URL } from '../baseUrl';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { DeviceResponse, NewDevice, Device } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private baseUrl = `${DEVICES_URL}`;  

  constructor(private http: HttpClient) {}

  /** Attach Authorization header from localStorage */
  private authOptions() {
    const token = localStorage.getItem('accessToken') || '';
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

  /** GET /devices/me → list all devices belonging to the authenticated user */
  listMine(): Observable<Device[]> {
    return this.http
      .get<DeviceResponse[]>(`${this.baseUrl}/me`, this.authOptions())
      .pipe(
        map(responses => responses.map(r => r.data)),
        tap(devs => console.log('Fetched devices:', devs)),
        catchError(this.handleError)
      );
  }

  /** POST /devices → register a new device under the user */
  addDevice(device: NewDevice): Observable<Device> {
    return this.http
      .post<DeviceResponse>(this.baseUrl, device, this.authOptions())
      .pipe(
        tap(res => console.log('Device created:', res.data)),
        map(res => res.data),
        catchError(this.handleError)
      );
  }

  /** PATCH /devices/:id → update some fields (e.g. status) */
  updateDevice(id: string, patch: Partial<NewDevice>): Observable<Device> {
    return this.http
      .patch<DeviceResponse>(`${this.baseUrl}/${id}`, patch, this.authOptions())
      .pipe(
        tap(res => console.log('Device updated:', res.data)),
        map(res => res.data),
        catchError(this.handleError)
      );
  }

  /** DELETE /devices/:id → remove device */
  deleteDevice(id: string): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.baseUrl}/${id}`, this.authOptions())
      .pipe(
        tap(() => console.log(`Device ${id} deleted`)),
        catchError(this.handleError)
      );
  }

  /** Centralized error handler */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Devices API Error:', error);
    let message = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // client‑side
      message = `Error: ${error.error.message}`;
    } else {
      // server‑side
      switch (error.status) {
        case 400:
          message = 'Invalid data. Please check your input.';
          break;
        case 401:
          message = 'You are not authorized. Please log in again.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 409:
          message = 'Conflict: resource already exists.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
      }
    }
    return throwError(() => new Error(message));
  }
}
