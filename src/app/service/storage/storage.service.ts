import { Injectable } from '@angular/core';
import {CookieService} from "ngx-cookie-service";

const ACCESS_TOKEN = 'auth-access';
const REFRESH_TOKEN = 'auth-refresh';
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookieService:CookieService) { }

  cleanAccessToken(): void {
    window.sessionStorage.clear();
  }

  cleanRefreshToken(): void {
    this.cookieService.delete(REFRESH_TOKEN)
  }

  public saveAccessToken(accessToken: string): void {
    window.sessionStorage.removeItem(ACCESS_TOKEN);
    window.sessionStorage.setItem(ACCESS_TOKEN, accessToken);
  }

  public saveRefreshToken(refreshToken: any): void {
    this.cookieService.delete(REFRESH_TOKEN);
    this.cookieService.set(REFRESH_TOKEN,refreshToken);
  }

  public getAccessToken(): String | null {
    return window.sessionStorage.getItem(ACCESS_TOKEN)
  }

  public getRefreshToken(): any {

    if (!this.hasRefreshToken()) {
      return null;
    }

    return this.cookieService.get(REFRESH_TOKEN);
  }

  public isLoggedIn(): boolean {
    const token = window.sessionStorage.getItem(ACCESS_TOKEN);
    return !!token;
  }

  public hasRefreshToken(): boolean {
    return this.cookieService.check(REFRESH_TOKEN);
  }

}
