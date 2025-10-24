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
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = environment.apiUrl;

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
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials);
  }

  signup(data: SignupDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/signup`, data);
  }

  logout(): Observable<any> {
    this.clearSession(); 
    this.storage.removeItem('token'); 
    this.router.navigate(['/login']); 
    return this.http.post(`${this.baseUrl}/auth/logout`, {}); 
  }

  navigateByRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'admin':
        this.router.navigate(['/admindashboard']);
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
    return this.http.get<userInfoDto>(`${this.baseUrl}/auth/userInfo`, { headers });
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
    return this.http.get<{ data: Product[], total: number }>(`${this.baseUrl}/auth/vehicledetails`, { params: httpParams });
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
    return this.http.get<{ data: Product[], total: number }>(`${this.baseUrl}/auth/vehicledetails`, { params: httpParams });
  }

   getSellerVehicles(): Observable<any> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, 
    });

    return this.http.get(`${this.baseUrl}/auth/seller/vehicledetails`, { headers });
  }

  getTotal() {
    return this.http.get<number | { total: number }>(
      `${this.baseUrl}/auth/eois/last7days`
    );
  }

 createVehicles(vehicle: FormData) {
  const token = localStorage.getItem('token');

  return this.http.post(`${this.baseUrl}/auth/addvehicledetail`, vehicle, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

  updateVehicles(id: string, formData: FormData) {
    return this.http.put(
      `${this.baseUrl}/auth/updatevehicledetail/${id}`,
      formData
    );
  }
  
  deleteVehicle(id: number) {
    return this.http.delete(`${this.baseUrl}/auth/deletevehicledetail/${id}`);
  }

  activateVehicle(id: string, payload: { reason?: string }) {
    return this.http.put<any>(
      `${this.baseUrl}/auth/activatevehicledetail/${id}`,
      payload,
      { headers: this.getAuthHeaders() }
    );
  }

  deactivateVehicle(id: string, payload: { reason?: string }) {
    return this.http.put<any>(
      `${this.baseUrl}/auth/deactivatevehicledetail/${id}`,
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
    `${this.baseUrl}/auth/blockUser/${id}`,
    { reason: reason || null }, 
    { headers: this.getAuthHeaders() }
  );
}

unblockUser(id: string) {
  return this.http.put<any>(
    `${this.baseUrl}/auth/unblockUser/${id}`,
    {},
    { headers: this.getAuthHeaders() }
  );
}

getUsers() {
  return this.http.get<any>(
    `${this.baseUrl}/auth/users`,
    { headers: this.getAuthHeaders() } 
  );
}

getStatusById(id: string) {
  return this.http.get<any>(
    `${this.baseUrl}/auth/adminAudit/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

getvehicleById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/auth/vehicledetails/${id}`)
}

addExpressions(payload: {
  buyer_id: string;       
  listing_id: number;     
  vehicle_name?: string;  
  vehicle_price?: number; 
  message: string;        
  contact_phone: string;  
  preferred_contact_time?: string;
  status?: 'new' | 'contacted' | 'closed';
}) {
  return this.http.post<any>(
    `${this.baseUrl}/auth/addExpressions`,
    payload,
    { headers: this.getAuthHeaders() }
  );
}

getExpressionsById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.baseUrl}/auth/expressions/${id}`)
}

 markVehicleSoldByld(id: string) {
    return this.http.put<any>(
      `${this.baseUrl}/auth/sold/${id}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getbuyerStatusById(id: string) {
  return this.http.get<any>(
    `${this.baseUrl}/auth/buyerStatus/${id}`,
    { headers: this.getAuthHeaders() }
  );
}

// getBuyerStatusByProduct(productId: string) {
//   return this.http.get<any>(`${this.baseUrl}/auth/buyerStatus?productId=${productId}`);
// }
getBuyerStatusByProduct(id: string) {
  return this.http.get<any>(`${this.baseUrl}/auth/buyerStatus/${id}`);
}

 markContactedByld(id: string, statusToBeSet: string) {
    return this.http.put<any>(
      `${this.baseUrl}/auth/expressions/${id}`,
      {status: statusToBeSet},
      { headers: this.getAuthHeaders() }
    );
  }

    getSummery() {
    return this.http.get<number | { total: number }>(
      `${this.baseUrl}/auth/vehicledetails/summary`
    );
  }

forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgotpassword`, { email });
  }

resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/resetpassword`, {
    token,
    newPassword,
  });
}

}