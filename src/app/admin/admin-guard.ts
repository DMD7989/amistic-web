import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supabase } from '../supabase';

export const adminGuard: CanActivateFn = async () => {
  const sb = inject(Supabase);
  const router = inject(Router);
  await sb.ready;
  return sb.session() ? true : router.createUrlTree(['/admin/login']);
};
