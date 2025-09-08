import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupDto } from '../models/signup.model.dto';
import { Storage } from './storage';
import { userInfoDto } from '../models/userinfo.model.dto';
import { HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
import { LoginDto } from '../models/login.model.dto';
import { Product } from '../models/product.dto';

@Injectable({
  providedIn: 'root'
})
export class Auth {

 constructor(private http:HttpClient,private storage: Storage, private router: Router){}

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
login(credentials: LoginDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }
navigateByRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'user':
        this.router.navigate(['/user']);
        break;
      case 'buyer':
        this.router.navigate(['/buyer']);
        break;
      case 'seller':
        this.router.navigate(['/seller']);
        break;
      default:
        this.router.navigate(['/login']); // fallback
    }
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

 private apiUrl3 = 'http://localhost:5001/api/auth/vehicledetails';

getProducts(params?: { [key: string]: any }): Observable<{ data: Product[], total: number }> {
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
  }
  return this.http.get<{ data: Product[], total: number }>(this.apiUrl3, { params: httpParams });
}
}
