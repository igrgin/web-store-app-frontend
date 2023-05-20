import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {catchError, Observable, switchMap, throwError} from 'rxjs';
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  refresh = false;

  constructor(private authService: AuthService, private storageService:StorageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone(this.storageService.getAccessToken() ? {
      setHeaders:{
        Authorization: `Bearer ${this.storageService.getAccessToken()}`,
      }
    } : {});

    return next.handle(req).pipe(catchError((err:HttpErrorResponse) => {

      if (err.status === 401 && !this.refresh)
      {
        this.refresh = true
        return this.authService.refreshToken().pipe(
          switchMap((_) => {
            return next.handle(request.clone({
              setHeaders:{
                Authorization: `Bearer ${this.storageService.getAccessToken()}`,
              }
            }))
          })
        )
      }
      this.refresh = false
      return throwError(() => err)
    }));

  }




}

export const authenticationInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true }
];
