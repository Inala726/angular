import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { bootstrapBell, bootstrapGear, bootstrapHouse, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { heroHome } from '@ng-icons/heroicons/outline';
import { monoLogOut } from '@ng-icons/mono-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DevicesService } from '../services/devices.service';
import { DeviceRegistrationModalComponent } from '../components/device-registration-modal/device-registration-modal.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'smart-home-dashboard',
  standalone: true,
  imports: [CommonModule, NgIcon, DeviceRegistrationModalComponent],
  viewProviders: [provideIcons({ bootstrapHouse, bootstrapGear, bootstrapPlus, bootstrapBell, heroHome, monoLogOut })],
  templateUrl: './app-smart-home-dashboard.component.html',
  styleUrls: ['./app-smart-home-dashboard.component.scss'],
})
export class SmartHomeDashboardComponent {
  firstName = ''; // Optionally fetch from AuthService
  isModalOpen = false;
  devices$;

  constructor(
    private devicesService: DevicesService,
    private authService: AuthService
  ) {
    this.devices$ = this.devicesService.devices$; // Initialize after injection
  }
ngOnInit() {
    this.authService.getProfile().subscribe({
      next: profile => this.firstName = profile.firstName,
      error: _ => {
        // e.g. redirect to login if 401
        console.warn('Could not fetch profile');
      }
    });
  }
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  trackByDeviceId(index: number, d: any) {
    return d.id;
  }

  onLogout() {
    this.authService.logout();
  }
}