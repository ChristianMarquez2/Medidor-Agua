import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { RegistrosService } from '../services/registros.service';

/**
 * Factory de Guards para verificar roles de usuario.
 * Redirige a '/login' si no hay sesión.
 * Redirige a '/home' si el rol no coincide.
 *
 * @param allowedRoles Array de strings con los roles permitidos (ej. ['admin'] o ['medidor'])
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return async () => {
    // 1. Inyecta los servicios (¡NO crea nuevos clientes!)
    const registrosService = inject(RegistrosService);
    const router = inject(Router);

    // 2. Usa el servicio para obtener el rol (ya no duplicamos lógica)
    const role = await registrosService.getUserRole();

    if (!role) {
      // No hay usuario logueado, redirige a /login
      console.log('AuthGuard: No hay rol. Redirigiendo a login.');
      return router.parseUrl('/login');
    }

    if (allowedRoles.includes(role)) {
      // El rol está permitido
      return true;
    }

    // El rol no está permitido, redirige a /home
    // (home.page.ts se encargará de enviarlo a su dashboard correcto)
    console.log(`AuthGuard: Rol '${role}' no permitido. Redirigiendo a home.`);
    return router.parseUrl('/home');
  };
};

/**
 * Guard simple para verificar si el usuario está logueado (sin importar el rol)
 */
export const authGuard: CanActivateFn = async () => {
  const registrosService = inject(RegistrosService);
  const router = inject(Router);

  const role = await registrosService.getUserRole();

  if (!role) {
    console.log('AuthGuard: No hay rol. Redirigiendo a login.');
    return router.parseUrl('/login');
  }

  // Si hay un rol (cualquiera), está autenticado
  return true;
};