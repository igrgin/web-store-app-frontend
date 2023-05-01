import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";

const AUTH_API = 'http://localhost:8080/auth/api/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'authenticate',
      {
        email,
        password,
      },
      httpOptions
    );
  }

  register(email: string, password: string, first_name:string, last_name:string): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      {
        email,
        password,
        first_name,
        last_name
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'logout', { }, httpOptions);
  }

  refreshToken() {
    return this.http.post(AUTH_API + 'refresh', { }, httpOptions);
  }
}
