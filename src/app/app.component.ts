import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
<app-navbar *ngIf="showNavbar"/>
<main>
  <router-outlet/>
</main>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'smart-home-project';
  showNavbar = true;

  // Routes where navbar should be hidden
  private hiddenNavbarRoutes = ['/signin', '/signup', '/login', '/register'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showNavbar = !this.hiddenNavbarRoutes.includes(event.url);
      });
  }
}