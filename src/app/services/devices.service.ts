// src/app/services/devices.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NewDevicePayload, DeviceResponse, Device } from '../types';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { DEVICES_URL } from '../baseUrl';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private apiUrl = `${DEVICES_URL}`;
  private _devices = new BehaviorSubject<Device[]>([]);
  public devices$ = this._devices.asObservable();

  constructor(private http: HttpClient) {
    // rehydrate from localStorage on service init
    const saved = localStorage.getItem('myDevices');
    if (saved) this._devices.next(JSON.parse(saved));
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken')!;
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  addDevice(payload: NewDevicePayload, extras: {location:string, model?:string, description?:string}): Observable<DeviceResponse> {
    return this.http
      .post<DeviceResponse>(this.apiUrl, payload, { headers: this.authHeaders() })
      .pipe(
        tap(res => {
          // merge server data + our extras into a full Device
          const full: Device = {
            id: res.data.id,
            name: res.data.name,
            protocol: res.data.protocol,
            status: res.data.status,
            location: extras.location,
            model: extras.model,
            description: extras.description
          };
          // update in‑memory list + localStorage
          const updated = [...this._devices.value, full];
          this._devices.next(updated);
          localStorage.setItem('myDevices', JSON.stringify(updated));
        }),
        catchError(this.handleError)
      );
  }

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
