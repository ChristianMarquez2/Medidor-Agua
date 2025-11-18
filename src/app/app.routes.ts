import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Si no hay ruta, va al login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    // ¡¡ESTA ES LA LÍNEA CORREGIDA!!
    loadComponent: () =>
      import('./register.page/register.page').then((m) => m.RegisterPage), // ANTES: './register.page/register.page'
  },
  {
    path: 'home', // La página 'guardián'
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    // ¡ESTA ES LA RUTA MÁS IMPORTANTE!
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    // ¡NUEVO! Carga las rutas HIJAS (las pestañas)
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: '**', // Cualquier otra ruta
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // ELIMINADAS las rutas de 'registro-lectura', 'mis-lecturas', etc.
  // Esas rutas AHORA VIVEN en 'src/app/tabs/tabs.routes.ts'
];