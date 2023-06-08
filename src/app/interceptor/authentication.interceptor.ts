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
import {Router} from "@angular/router";
import {ToastService} from "../service/toast/toast.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private refresh: boolean = false;

  constructor(private authService: AuthService, private storageService: StorageService,
              private toastService:ToastService, private router:Router) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    console.log("refresh: ", this.storageService.getRefreshToken())
    console.log("access: ", this.storageService.getAccessToken())
    console.log("url: ",request.url)

    const req = request.url.includes("public") ? request.clone(): request.url.includes("refresh") ?
      request.clone( {setHeaders: {Authorization: `Bearer ${this.storageService.getRefreshToken()}`},
        withCredentials: true}) : request.clone({setHeaders: {Authorization: `Bearer ${this.storageService.getAccessToken()}`},
        withCredentials: true});

    console.log("req  ", req)
    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !this.refresh && !request.url.includes("refresh")) {
        this.refresh = true
        return this.authService.refresh().pipe(
          switchMap((_) => {
            return next.handle(request.clone({
              setHeaders: {
                Authorization: `Bearer ${this.storageService.getAccessToken()}`,
              }
            }))
          })
        )
      }
      this.refresh = false
      return throwError(() => {
        this.authService.onLoginStatusChange.emit({action:false,shouldToast:false})
        this.authService.user=undefined
        this.router.navigate(['login']);
        this.toastService.showError("a problem occurred","You've been signed out.")
      })
    }));
  }
}

export const authenticationInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}
];
