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

  constructor(private authService: AuthService, private storageService: StorageService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.log("refresh: ", this.storageService.getRefreshToken())
    console.log("access: ", this.storageService.getAccessToken())
    console.log("url: ", request.url)

    const req = request.url.includes("private") ?
      request.clone({setHeaders: {Authorization: `Bearer ${this.storageService.getAccessToken()}`},
        withCredentials: true}) : request.clone();
    console.log("req  ", req)
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
      console.error(err)
      if (err.status === 401 && this.storageService.isLoggedIn() && !request.url.includes("refresh")) {
        return this.authService.refresh().pipe(
          switchMap((_) => {
            return next.handle(request.clone({
              setHeaders: {Authorization: `Bearer ${this.storageService.getAccessToken()}`},
              withCredentials: true
            }))
          }), catchError(() => throwError(() => {}))
        )
      }
      return throwError(() => {})
    }));
  }

}

export const authenticationInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}
];
