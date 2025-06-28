import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service'; // Adjust path if needed
import { Alert } from '../types';

@Component({
  selector: 'app-system-alerts',
  imports: [CommonModule],
  templateUrl: './system-alerts.component.html',
  styleUrls: ['./system-alerts.component.scss']
})
export class SystemAlertsComponent implements OnInit {
  alerts: Alert[] = []; // Initialize as empty array
  loading = true;       // Start with loading true
  error: string | null = null; // Error message

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchAlerts();
  }

  private fetchAlerts() {
    this.loading = true;
    this.adminService.getAllAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts; // Update alerts with API data
        this.loading = false; // Data loaded
      },
      error: (error) => {
        this.error = error.message; // Set error message
        this.loading = false;       // Stop loading
      }
    });
  }
}