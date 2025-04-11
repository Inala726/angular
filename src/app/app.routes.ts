import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      const m = await import('./homepage/homepage.component');
      return m.HomepageComponent;
    },
  },
  {
    path: 'dashboard',
    loadComponent: async () => {
      const m = await import(
        './app-smart-home-dashboard/app-smart-home-dashboard.component'
      );
      return m.SmartHomeDashboardComponent;
    },
  },
];
