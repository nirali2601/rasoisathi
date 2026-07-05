import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSignalStore } from '../stores/auth-signal.store';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthSignalStore);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};
