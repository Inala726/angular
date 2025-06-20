// src/app/components/device-registration-modal/device-registration-modal.component.ts
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {bootstrapPlus} from '@ng-icons/bootstrap-icons'

@Component({
  selector: 'app-device-registration-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIcon],
  viewProviders: [provideIcons({bootstrapPlus})],
  templateUrl: './device-registration-modal.component.html',
  styleUrls: ['./device-registration-modal.component.scss']
})
export class DeviceRegistrationModalComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() deviceAdded = new EventEmitter<void>();

  deviceForm!: FormGroup;
  loading = false;  // ← so template can bind [disabled]="loading"
  errorMsg = '';

  // these drive your two dropdowns
  protocols = ['ZIGBEE', 'BLUETOOTH', 'WI-FI'];
  locations   = ['LIVING_ROOM', 'BEDROOM', 'KITCHEN', 'BATHROOM'];

  constructor(
    private fb: FormBuilder,
    private devicesService: DevicesService
  ) {}

  ngOnInit() {
    this.deviceForm = this.fb.group({
      name:     ['', Validators.required],
      protocol: ['', Validators.required],         // e.g. your "deviceType"
      status:   ['offline', Validators.required],  // default to offline
      location: ['', Validators.required],
      brand:       [''],
      model:       [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.deviceForm.invalid) return;

    this.loading = true;
    const { name, protocol, status, location, brand, model, description } = this.deviceForm.value;

    // only send the 3 fields the API supports in the payload
    const payload = { name, protocol, status };
    // stash the rest locally
    const extras = { location, brand, model, description };

    this.devicesService
      .addDevice(payload, extras)
      .subscribe({
        next: () => {
          this.loading = false;
          this.deviceForm.reset({ status: 'offline' });
          this.deviceAdded.emit();
          this.close.emit();
        },
        error: err => {
          this.loading = false;
          this.errorMsg = err.message || 'Registration failed';
        }
      });
  }

  closePanel() {
    this.close.emit();
  }

  formatOption(value: string): string {
    return value
      .split(/[_\s]+/)
      .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }
}
