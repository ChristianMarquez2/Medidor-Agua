import { Routes } from '@angular/router';
// Importamos los guards
import { authGuard, roleGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '', // Ruta raíz de 'tabs' (ej. /tabs)
    // Redirige al dashboard correcto (home.page.ts se encarga de la lógica)
    loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard], // Protegido, necesitas estar logueado
  },
  {
    path: 'mis-lecturas', // Ruta: /tabs/mis-lecturas
    loadComponent: () =>
      // Sube un nivel (../) para encontrar la carpeta 'mis-lecturas'
      import('../mis-lecturas/mis-lecturas.page').then(
        (m) => m.MisLecturasPage
      ),
    canActivate: [roleGuard(['medidor'])], // Protegido por rol
  },
  {
    path: 'registro-lectura', // Ruta: /tabs/registro-lectura
    loadComponent: () =>
      // Sube un nivel (../)
      import('../registro-lectura/registro-lectura.page').then(
        (m) => m.RegistroLecturaPage
      ),
    canActivate: [roleGuard(['medidor'])], // Protegido por rol
  },
  {
    path: 'admin-registros', // Ruta: /tabs/admin-registros
    loadComponent: () =>
      // Sube un nivel (../)
      import('../admin-registros/admin-registros.page').then(
        (m) => m.AdminRegistrosPage
      ),
    canActivate: [roleGuard(['admin'])], // Protegido por rol
  },
  {
    path: 'perfil', // Ruta: /tabs/perfil
    loadComponent: () =>
      // Sube un nivel (../)
      import('../perfil/perfil.page').then((m) => m.PerfilPage),
    canActivate: [authGuard], // Cualquiera logueado puede verla
  },
];