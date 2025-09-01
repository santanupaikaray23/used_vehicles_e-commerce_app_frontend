import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login.model.dto';
import { SignupDto } from '../models/signup.model.dto';
// import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  constructor(private http:HttpClient){}

  //  setToken(key: string, token: string): void {
  //   localStorage.setItem(key, token);
  // }

  // getToken(p0: string) {
  //   if (isPlatformBrowser(this.platformId)) {
  //     return localStorage.getItem('authToken');
  //   }
  //   return null; 
  // }
 
  // clearToken(key: string): void {
  //   localStorage.removeItem(key);
  // }

  private apiUrl = 'http://localhost:5001/api/auth/login';

  login(data:LoginDto): Observable<any> {
    return this.http.post(this.apiUrl, data)
  }

  private apiUrl1 = 'http://localhost:5001/api/auth/signup';

  signup(data:SignupDto): Observable<any> {
    return this.http.post(this.apiUrl1, data)
  }
  
}
