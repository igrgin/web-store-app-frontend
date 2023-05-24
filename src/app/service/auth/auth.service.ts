import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from "rxjs";
import {UserProfile} from "../../interface/auth/user-profile";
import {LoginModel} from "../../interface/auth/login-model";
import {TokenModel} from "../../interface/auth/token-model";
import {RegisterModel} from "../../interface/auth/register-model";
import {StorageService} from "../storage/storage.service";

const AUTH_API = 'http://localhost:8080/auth/api/';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  onLoginStatusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private storageService:StorageService) {
  }


  login(payload: LoginModel): Observable<TokenModel> {
    return this.http.post<TokenModel>(
      AUTH_API + 'authenticate',
      payload,
      {withCredentials: true, headers: {'Content-Type': 'application/json'}}
    ).pipe(
      tap((value) => {
        this.storageService.saveRefreshToken(value.refresh_token)
        this.storageService.saveAccessToken(value.access_token)
        this.onLoginStatusChange.emit(true);

      }));
  }

  register(registerModel: RegisterModel): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      registerModel,
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', {}, httpOptions).pipe(
      tap(() => {
        this.storageService.cleanAccessToken()
        this.storageService.cleanRefreshToken()
        this.onLoginStatusChange.emit(false);
      }));
  }

  refresh(): Observable<TokenModel> {
    return this.http.post<TokenModel>(AUTH_API + 'refresh', {},
      {withCredentials: true, headers: {'Content-Type': 'application/json'}}).pipe(
      tap((value) => {
        this.storageService.saveRefreshToken(value.refresh_token)
        this.storageService.saveAccessToken(value.access_token)
      }));
  }

  getUserProfile():Observable<UserProfile>
  {
    return this.http.get<UserProfile>('user/api/user',
      {withCredentials: true, headers: {'Content-Type': 'application/json'}});

  }

}
