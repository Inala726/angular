import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';     // ← import
import { UserManagementComponent } from '../user-management/user-management.component';
import { DeviceManagementComponent } from '../device-management/device-management.component';
import { SystemAlertsComponent } from '../system-alerts/system-alerts.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserManagementComponent,
    DeviceManagementComponent,
    SystemAlertsComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  activeTab: 'users' | 'alerts' | 'devices' = 'users';

  constructor(private auth: AuthService, private router:Router) {}  // ← inject

  setActiveTab(tab: 'users' | 'alerts' | 'devices') {
    this.activeTab = tab;
  }

  onLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/admin/login']);
  }
}
