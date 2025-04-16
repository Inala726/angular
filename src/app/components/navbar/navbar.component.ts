import { Component } from '@angular/core';
import {ionMenu} from '@ng-icons/ionicons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  imports: [NgIcon],
  viewProviders: [provideIcons({ionMenu})],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
