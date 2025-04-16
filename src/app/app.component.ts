import { Component } from '@angular/core';
import { HomepageComponent } from './homepage/homepage.component';

@Component({
  selector: 'app-root',
  imports: [HomepageComponent],
  template: `
  <app-homepage/>
  `,
  styles: [],
})
export class AppComponent {
  title = 'smart-home-project';
}
