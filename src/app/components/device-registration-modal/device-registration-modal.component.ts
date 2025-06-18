// src/app/device-registration-modal/device-registration-modal.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { NewDevice, Device } from '../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-device-registration-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './device-registration-modal.component.html',
  styleUrls: ['./device-registration-modal.component.scss']
})
export class DeviceRegistrationModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() added = new EventEmitter<Device>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private devicesSvc: DevicesService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      protocol: ['Zigbee', Validators.required],
      status: ['offline', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';

    const payload: NewDevice = this.form.value;
    this.devicesSvc.addDevice(payload).subscribe({
      next: device => {
        this.loading = false;
        this.added.emit(device);
        this.close.emit();
        this.form.reset({ protocol: 'Zigbee', status: 'offline' });
      },
      error: err => {
        this.loading = false;
        this.error = err.message;
      }
    });
  }

  onCancel() {
    this.form.reset({ protocol: 'Zigbee', status: 'offline' });
    this.close.emit();
  }
}
