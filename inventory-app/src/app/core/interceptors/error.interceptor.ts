import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((err) => {
      const body = err.error;
      const detail = body?.message || err.statusText || 'Error inesperado';
      messageService.add({
        severity: 'error',
        summary: `Error ${body?.status || err.status}`,
        detail,
        life: 5000,
      });
      return throwError(() => err);
    })
  );
};
