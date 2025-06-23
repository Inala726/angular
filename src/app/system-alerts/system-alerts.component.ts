import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-system-alerts',
  imports: [CommonModule],
  templateUrl: './system-alerts.component.html',
  styleUrls: ['./system-alerts.component.scss']
})
export class SystemAlertsComponent {
  alerts = [
    { 
      type: 'Security', 
      message: 'Unauthorized access detected in living room', 
      deviceId: 'b3c2a855-3e5c-4d9d-869e-3f9b0c98abc1', 
      timestamp: '01/06/2025, 13:01:00' 
    },
    { 
      type: 'Energy', 
      message: 'High energy consumption detected on kitchen appliances', 
      deviceId: 'c4d5e6f7-8a9b-0c1d-2e3f-4a5bbc748e9f', 
      timestamp: '01/06/2025, 12:30:00' 
    },
    { 
      type: 'Maintenance', 
      message: 'Device offline - requires attention', 
      deviceId: 'e6f7g810-011j-2k31-4m5n-6o7p8q9r0e51t', 
      timestamp: '01/06/2025, 11:45:00' 
    }
  ];
}