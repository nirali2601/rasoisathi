import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthSignalStore } from '../stores/auth-signal.store';
import { SnackService } from '../services/snack.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthSignalStore);
  const snack = inject(SnackService);
  const token = auth.token();
  const request = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = error.error?.message || 'Unable to complete request';
      if (error.status === 401) auth.logout();
      snack.show(message);
      return throwError(() => error);
    })
  );
};
