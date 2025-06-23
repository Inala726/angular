// src/app/services/toast.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private toasts$ = new BehaviorSubject<Toast[]>([]);

  /** Observable stream of active toasts */
  get toastsObservable() {
    return this.toasts$.asObservable();
  }

  private nextId = 0;

  show(message: string, type: ToastType = 'success', duration = 4000) {
    const toast: Toast = { message, type, id: this.nextId++ };
    this.toasts.push(toast);
    this.toasts$.next(this.toasts);

    // auto‐dismiss
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toasts$.next(this.toasts);
  }
}
