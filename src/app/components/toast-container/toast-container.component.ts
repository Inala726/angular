import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent {
  toasts: Toast[] = [];
  constructor(public toastService:ToastService){
    this.toastService.toastsObservable.subscribe(ts => this.toasts = ts);
  }
}
