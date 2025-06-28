import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'; // Adjust path as needed
import { Device } from '../types'; // Adjust path as needed

@Component({
  selector: 'app-device-management',
  imports: [CommonModule],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = [];
  loading = true;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchDevices();
  }

  private fetchDevices() {
    this.loading = true;
    this.adminService.getAllDevices().subscribe({
      next: (devices) => {
        this.devices = devices;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}