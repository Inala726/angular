import { Routes } from '@angular/router';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      const m = await import('./homepage/homepage.component');
        return m.HomepageComponent;
    }
},
{
  path: 'signup',
  loadComponent: async () =>{
    const m = await import('./signup/signup.component');
    return m.SignupComponent;
  }
},
{
  path: 'signin',
  loadComponent: async () =>{
    const m = await import('./signin/signin.component');
    return m.SigninComponent;
  }
}
];
