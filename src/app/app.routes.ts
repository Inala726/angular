import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

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
    path: 'signup',
    loadComponent: async () => {
      const m = await import('./signup/signup.component');
      return m.SignupComponent;
    },
  },
  {
    path: 'signin',
    loadComponent: async () => {
      const m = await import('./signin/signin.component');
      return m.SigninComponent;
    },
  },
  {
    path: 'verify-email',
    loadComponent: async () => {
      const m = await import('./verify-email/verify-email.component');
      return m.VerifyEmailComponent;
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
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/dashboard',
    loadComponent: async () => {
      const m = await import('./admin-dashboard/admin-dashboard.component');
      return m.AdminDashboardComponent;
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/login',
    loadComponent: async () => {
      const m = await import('./admin-login/admin-login.component');
      return m.AdminLoginComponent;
    },
  },
  {
    path: 'admin/register',
    loadComponent: async()=>{
      const m = await import('./admin-registration/admin-registration.component')
      return m.AdminSignupComponent
    }
  }
];
