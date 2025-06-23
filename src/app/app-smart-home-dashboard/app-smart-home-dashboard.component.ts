import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { 
  bootstrapBell, 
  bootstrapGear, 
  bootstrapHouse, 
  bootstrapPlus,
  bootstrapThermometerHalf 
} from '@ng-icons/bootstrap-icons';
import { heroHome, heroLightBulb } from '@ng-icons/heroicons/outline';
import { monoLogOut } from '@ng-icons/mono-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AuthService } from '../services/auth.service';
import { DevicesService } from '../services/devices.service';
import { DeviceRegistrationModalComponent } from '../components/device-registration-modal/device-registration-modal.component';

@Component({
  selector: 'smart-home-dashboard',
  standalone: true,
  imports: [CommonModule, NgIcon, DeviceRegistrationModalComponent],
  viewProviders: [provideIcons({ 
    bootstrapHouse, 
    bootstrapGear, 
    bootstrapPlus, 
    bootstrapBell, 
    heroHome, 
    monoLogOut,
    heroLightBulb,
    bootstrapThermometerHalf
  })],
  templateUrl: './app-smart-home-dashboard.component.html',
  styleUrls: ['./app-smart-home-dashboard.component.scss'],
})
export class SmartHomeDashboardComponent {
  firstName = '';
  isModalOpen = false;
  devices$;

  constructor(
    private devicesService: DevicesService,
    private authService: AuthService
  ) {
    this.devices$ = this.devicesService.devices$;
  }
ngOnInit() {
    this.authService.getProfile().subscribe({
      next: profile => this.firstName = profile.firstName,
      error: _ => {
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

  confirmDelete(id: string) {
  const confirmed = confirm('Are you sure you want to delete this device?');
  if (confirmed) return
  this.devicesService.deleteDevice(id).subscribe({
    next: () => {
      console.log('Device deleted');
      // optionally show toast or update UI
    },
    error: err => {
      console.error('Delete failed:', err.message);
      // optionally show error toast
    }
  });
}

  onLogout() {
    this.authService.logout();
  }
}