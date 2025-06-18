import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { bootstrapBell, bootstrapGear, bootstrapHouse, bootstrapPlus } from '@ng-icons/bootstrap-icons';
import { heroHome } from '@ng-icons/heroicons/outline';
import {monoLogOut} from '@ng-icons/mono-icons'
import { NgIcon, provideIcons } from '@ng-icons/core';
import { DevicesService } from '../services/devices.service';
import { Device, UserProfile } from '../types';
import { DeviceRegistrationModalComponent } from "../components/device-registration-modal/device-registration-modal.component";
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'smart-home-dashboard',
  imports: [NgIcon, CommonModule, DeviceRegistrationModalComponent],
  viewProviders: [provideIcons({bootstrapHouse, heroHome, bootstrapBell, bootstrapGear, bootstrapPlus, monoLogOut})],
  templateUrl: './app-smart-home-dashboard.component.html',
  styleUrl: './app-smart-home-dashboard.component.scss',
})
export class SmartHomeDashboardComponent implements OnInit {
  firstName = '';
  devices: Device[] = [];
  isModalOpen = false;
  error = '';

  constructor(private devicesSvc: DevicesService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.getUserProfile().subscribe({
      next: (user: UserProfile) => this.firstName = user.firstName,
      error: () => this.firstName = ''
    });

  
    this.devicesSvc.listMine().subscribe({
      next: devs => this.devices = devs,
      error: err => this.error = err.message
    });
  }

  onDeviceAdded(device: Device) {
    this.devices.unshift(device);
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }  
}
