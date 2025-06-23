import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  users = [
    { 
      name: 'John Doe', 
      email: 'john@example.com', 
      role: 'user', 
      created: '15/01/2024',
      actions: ['💬️', '☆', '💬️']
    },
    { 
      name: 'Jane Smith', 
      email: 'jane@example.com', 
      role: 'user', 
      created: '20/01/2024',
      actions: ['💬️', '☆', '💬️']
    },
    { 
      name: 'Bob Wilson', 
      email: 'bob@example.com', 
      role: 'user', 
      created: '01/02/2024',
      actions: ['💬️', '☆', '💬️']
    }
  ];
}