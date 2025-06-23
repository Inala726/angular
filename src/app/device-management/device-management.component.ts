import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-device-management',
  imports: [CommonModule],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.scss']
})
export class DeviceManagementComponent {
  devices = [
    { 
      name: 'Living Room Light', 
      protocol: 'Zigbee', 
      status: 'offline', 
      ownerId: 'f47ac1db-58cc-4372-a567-0e02b2c3d479', 
      deviceId: 'b3e2a86S-3e5c-4d04-869e-3f9b9c9@abc1' 
    },
    { 
      name: 'Kitchen Smart Plug', 
      protocol: 'WiFi', 
      status: 'online', 
      ownerId: 'a1b2c3d4-5e6f-7g8h-91ej-k11zn3n46Sp6', 
      deviceId: 'c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f' 
    },
    { 
      name: 'Bedroom Thermostat', 
      protocol: 'Zigbee', 
      status: 'maintenance', 
      ownerId: 'q7r8s9t0-1u2v-3w4x-5y6z-7a8b9c0d1ezf', 
      deviceId: 'e6f7g8h9-011j-2k31-4a5b-6o7p8q9r8s1t' 
    }
  ];
}