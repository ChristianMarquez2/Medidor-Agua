import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export const userGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (!profile || profile.rol !== 'medidor') {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
