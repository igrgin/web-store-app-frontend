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

    constructor(private authService: AuthService, private storageService: StorageService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const req = !request.url.includes("refresh") ? request.clone(this.storageService.getAccessToken() && !request.url.includes("public") ? {
            setHeaders: {
                Authorization: `Bearer ${this.storageService.getAccessToken()}`,
            }
        } : {}) : request.clone({setHeaders: {Authorization: `Bearer ${this.storageService.getRefreshToken()}`}});


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
            return throwError(() => err)
        }));

    }


}

export const authenticationInterceptorProviders = [
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true}
];
