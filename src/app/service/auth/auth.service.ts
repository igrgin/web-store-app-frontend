import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from "rxjs";
import {UserProfile} from "../../interface/auth/user-profile";
import {LoginModel} from "../../interface/auth/login-model";
import {TokenModel} from "../../interface/auth/token-model";
import {RegisterModel} from "../../interface/auth/register-model";
import {StorageService} from "../storage/storage.service";

const AUTH_API = 'http://localhost:8080/auth/api';
const USER_PROFILE_API = 'http://localhost:8080/user/api'

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  onLoginStatusChange: EventEmitter<{ action: boolean, shouldToast: boolean }> = new EventEmitter<{
    action: boolean,
    shouldToast: boolean
  }>();
  user?: UserProfile | undefined;
  logoutInProgress: boolean = false;

  constructor(private http: HttpClient, private storageService: StorageService) {
  }


  login(payload: LoginModel): Observable<TokenModel> {
    return this.http.post<TokenModel>(
      `${AUTH_API}/authenticate`,
      payload,
      {headers: {'Content-Type': 'application/json'}}
    ).pipe(
      tap((value) => {
        this.storageService.saveRefreshToken(value.refresh_token)
        this.storageService.saveAccessToken(value.access_token)
        this.onLoginStatusChange.emit({action: true, shouldToast: true});
      }));
  }

  register(registerModel: RegisterModel): Observable<any> {
    return this.http.post(`${AUTH_API}/register`,
      registerModel,
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${AUTH_API}/logout`, {}, {
      withCredentials: true,
      headers: {'Authorization': `Bearer ${this.storageService.getAccessToken()}`}
    }).pipe(
      tap(() => {
        console.log("logout")
        console.log("CLEAR-auth")
        this.user = undefined
        this.storageService.cleanRefreshToken()
        this.storageService.cleanAccessToken()
      }));
  }

  refresh(): Observable<TokenModel> {
    return this.http.post<TokenModel>(`${AUTH_API}/refresh`, {}, {
      withCredentials: true,
      headers: {'Authorization': `Bearer ${this.storageService.getRefreshToken()}`}
    }).pipe(
      tap((value) => {
        this.user = undefined
        console.log("inREFRESH")
        console.log("refresh ", value.refresh_token)
        console.log("access ", value.access_token)
        this.storageService.saveRefreshToken(value.refresh_token)
        this.storageService.saveAccessToken(value.access_token)
      }));
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${USER_PROFILE_API}/private/profile`,
      {withCredentials: true});

  };
}
