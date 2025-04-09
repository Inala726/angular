import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmartHomeDashboardComponent } from './app-smart-home-dashboard/app-smart-home-dashboard.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SmartHomeDashboardComponent],
  template: `
    <smart-home-dashboard/>
  `,
  styles: [],
})
export class AppComponent {
  title = 'smart-home-project';
}
