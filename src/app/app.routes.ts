import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
   {
    path: 'configuraciones',
    loadComponent: () => import('./configuraciones/configuraciones.page').then( m => m.ConfiguracionesPage)
  },
  {
    path: 'citas',
    loadComponent: () => import('./citas/citas.page').then( m => m.CitasPage)
  },
];
