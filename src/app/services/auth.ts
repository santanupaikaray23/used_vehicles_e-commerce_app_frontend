import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login.model.dto';
import { SignupDto } from '../models/signup.model.dto';
import { Storage } from './storage';
import { userInfoDto } from '../models/userinfo.model.dto';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Auth {
 
  constructor(private http:HttpClient,private storage: Storage){}

isLoggedIn(): boolean {
    return !!this.storage.getItem('token');
  }

  saveToken(token: string) {
    this.storage.setItem('token', token);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  private apiUrl = 'http://localhost:5001/api/auth/login';

  login(data:LoginDto): Observable<any> {
    return this.http.post(this.apiUrl, data)
  }

  private apiUrl1 = 'http://localhost:5001/api/auth/signup';

  signup(data:SignupDto): Observable<any> {
    return this.http.post(this.apiUrl1, data)
  }

private apiUrlLogout = 'http://localhost:5001/api/auth/logout';

logout(): Observable<any> {
  return this.http.post(this.apiUrlLogout, {}); 
}

private apiUrlProfile = 'http://localhost:5001/api/auth/userInfo';

 getUserinfo(): Observable<userInfoDto> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('x-access-token', token || '');

    return this.http.get<userInfoDto>(this.apiUrlProfile, { headers });
  }

}
