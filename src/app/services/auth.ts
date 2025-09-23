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
  private apiUrl = 'http://localhost:5001/api/auth/login';
  private apiUrl1 = 'http://localhost:5001/api/auth/signup';
  private apiUrlLogout = 'http://localhost:5001/api/auth/logout';
  private apiUrlProfile = 'http://localhost:5001/api/auth/userInfo';
  private apiUrl0 = 'http://localhost:5001/api/auth/vehicledetailsbuyer';
  private apiUrl3 = 'http://localhost:5001/api/auth/vehicledetails';
  private apiUrl4 = 'http://localhost:5001/api/auth';
   private apiUrl5 = 'http://localhost:5001/api/auth';

  private sessionKey = 'userSession';   

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {}

  saveSession(userData: any) {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(userData));
  }

  clearSession() {
    sessionStorage.removeItem(this.sessionKey);
  }

  isSessionActive(): boolean {
    return sessionStorage.getItem(this.sessionKey) !== null;
  }

  isLoggedIn(): boolean {
    return !!this.storage.getItem('token');
  }

  saveToken(token: string) {
    this.storage.setItem('token', token);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }


  login(credentials: LoginDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials);
  }

  signup(data: SignupDto): Observable<any> {
    return this.http.post(this.apiUrl1, data);
  }

  logout(): Observable<any> {
    this.clearSession(); 
    this.storage.removeItem('token'); 
    this.router.navigate(['/login']); 
    return this.http.post(this.apiUrlLogout, {}); 
  }

  navigateByRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admindashboard']);
        break;
      case 'user':
        this.router.navigate(['/user']);
        break;
      case 'buyer':
        this.router.navigate(['/buyerdashboard']);
        break;
      case 'seller':
        this.router.navigate(['/sellerdashboard']);
        break;
      default:
        this.router.navigate(['/login']); 
    }
  }

  getUserinfo(): Observable<userInfoDto> {
    const token = this.storage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token || '');
    return this.http.get<userInfoDto>(this.apiUrlProfile, { headers });
  }


  readVehicles(params?: { [key: string]: any }): Observable<{ data: Product[], total: number }> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return this.http.get<{ data: Product[], total: number }>(this.apiUrl0, { params: httpParams });
  }

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

  getTotal() {
    return this.http.get<number | { total: number }>(
      "http://localhost:5001/api/auth/vehicledetails/total"
    );
  }

  createVehicles(vehicle: FormData) {
    return this.http.post("http://localhost:5001/api/auth/addvehicledetail", vehicle);
  }

  updateVehicles(id: string, formData: FormData) {
    return this.http.put(
      `http://localhost:5001/api/auth/updatevehicledetail/${id}`,
      formData
    );
  }


  deleteVehicle(id: number) {
    return this.http.delete(`http://localhost:5001/api/auth/deletevehicledetail/${id}`);
  }

  activateVehicle(id: string, payload: { reason?: string }) {
    return this.http.put<any>(
      `${this.apiUrl4}/activatevehicledetail/${id}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  deactivateVehicle(id: string, payload: { reason?: string }) {
    return this.http.put<any>(
      `${this.apiUrl4}/deactivatevehicledetail/${id}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

blockUser(id: string, reason?: string) {
  return this.http.put<any>(
    `${this.apiUrl5}/blockUser/${id}`,
    { reason: reason || null }, // send reason if available
    { headers: this.getAuthHeaders() }
  );
}

unblockUser(id: string) {
  return this.http.put<any>(
    `${this.apiUrl5}/unblockUser/${id}`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

getUsers() {
  return this.http.get<any>(
    'http://localhost:5001/api/auth/users',
    { headers: this.getAuthHeaders() } 
  );
}

getStatus() {
  return this.http.get<any>(
    'http://localhost:5001/api/auth/adminAudit',
    { headers: this.getAuthHeaders() }

  );
}

getvehicleById(id: string): Observable<Product> {
  return this.http.get<Product>(`http://localhost:5001/api/auth/vehicledetails/${id}`)
}
}
