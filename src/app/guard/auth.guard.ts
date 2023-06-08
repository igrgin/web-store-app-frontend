import {EventEmitter, Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../service/auth/auth.service";
import {StorageService} from "../service/storage/storage.service";
import {Observable, of, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ToastService} from "../service/toast/toast.service";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  onLoginStatusChange: EventEmitter<{ action: boolean, shouldToast: boolean }> = new EventEmitter<{
    action: boolean,
    shouldToast: boolean
  }>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private jwtHelper: JwtHelperService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const routePath = route.url.map(value => value.path);
    console.log(routePath)

    if (!this.storageService.isLoggedIn() && !this.storageService.hasRefreshToken()
      && !(routePath.includes("admin") || routePath.includes("profile"))) {
      return of(true);
    }

    if (!this.storageService.isLoggedIn() && !this.storageService.hasRefreshToken()
      && (routePath.includes("admin") || routePath.includes("profile"))) {
      this.toastService.showInfo("log in to continue", "You must login to proceed.")
      this.authService.user=undefined
      this.router.navigate(['login']);
      return of(false);
    }

    if (!this.authService.user &&
      (this.storageService.hasRefreshToken() && this.jwtHelper.isTokenExpired(this.storageService.getRefreshToken())) &&
      (this.storageService.isLoggedIn() && this.jwtHelper.isTokenExpired((<string>this.storageService.getAccessToken()))))
      return this.checkRole(routePath)

    if ((this.storageService.hasRefreshToken() && this.jwtHelper.isTokenExpired(this.storageService.getRefreshToken()))) {
      this.toastService.showError("You've been logged out", "There was a problem logging you in.")
      this.onLoginStatusChange.emit({action:false,shouldToast:false})
      this.authService.user=undefined
      this.router.navigate(['login']);
      return of(false);
    }

    if (!this.storageService.isLoggedIn() && this.storageService.hasRefreshToken()) {
      return this.authService.refresh().pipe(
        switchMap(() => this.checkRole(routePath)),
        catchError(() => {
          this.toastService.showError("You've been logged out", "There was a problem logging you in.")
          this.onLoginStatusChange.emit({action:false,shouldToast:false})
          this.authService.user=undefined
          this.router.navigate(['login']);
          return of(false);
        })
      );
    } else {
      return this.checkRole(routePath)
    }
  }

  private checkRole(routePath: string[]): Observable<boolean> {
    return this.authService.getUserProfile().pipe(
      map(value => {
        this.authService.user = value;
        if (routePath.includes("admin")) {
          if (this.authService.user) {
            const role = this.authService.user.role;
            if (role === "ADMIN") {
              this.onLoginStatusChange.emit({action: true, shouldToast: false})
              return true;
            } else {
              this.toastService.showWarning("UNAUTHORIZED", "You are not allowed to enter this page")
              this.router.navigate(['home']);
              return false;
            }
          } else {
            this.onLoginStatusChange.emit({action: false, shouldToast: false})
            this.toastService.showError("An error occurred", "There was a problem while logging you in. " +
              "Please try again.")
            this.authService.user=undefined
            this.router.navigate(['login']);
            return false;
          }
        }
        this.onLoginStatusChange.emit({action: true, shouldToast: false})
        return true;
      }),
      catchError(err => {
        console.error(err);
        this.toastService.showError("An error occurred", "There was a problem while logging you into " +
          "the system. Please try again")
        this.authService.user=undefined
        this.router.navigate(['login']);
        this.onLoginStatusChange.emit({action: true, shouldToast: true})
        return of(false);
      })
    );
  }
}
