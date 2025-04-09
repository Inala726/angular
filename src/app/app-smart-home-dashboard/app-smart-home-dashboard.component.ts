import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smart-home-dashboard',
  imports: [],
  templateUrl: './app-smart-home-dashboard.component.html',
  styleUrl: './app-smart-home-dashboard.component.scss',
})
export class SmartHomeDashboardComponent implements OnInit {
  devices = [
    { name: 'Living Room Light', status: 'On', type: 'Light' },
    { name: 'Thermostat', status: '22°C', type: 'Temperature' },
    { name: 'Front Door Lock', status: 'Locked', type: 'Security' },
  ];

  alerts = [
    { message: 'Motion detected at Front Door', time: new Date() },
    { message: 'Energy consumption spike detected', time: new Date() },
  ];

  constructor() {}

  ngOnInit(): void {}

  toggleDevice(device: any) {
    if (device.type === 'Light') {
      device.status = device.status === 'On' ? 'Off' : 'On';
    }
  }
}
