import { Component } from '@angular/core';
import { UserManagementComponent } from '../user-management/user-management.component';
import { DeviceManagementComponent } from '../device-management/device-management.component';
import { SystemAlertsComponent } from '../system-alerts/system-alerts.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [UserManagementComponent, DeviceManagementComponent, SystemAlertsComponent, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  activeTab: 'users' | 'alerts' | 'devices' = 'users';

  setActiveTab(tab: 'users' | 'alerts' | 'devices') {
    this.activeTab = tab;
  }
}