import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../models/login.model';
import { SignupDto } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:5001/api/auth/login';

  constructor(private http:HttpClient){}

  login(data:LoginDto): Observable<any> {
    return this.http.post(this.apiUrl, data)
  }

  private apiUrl1 = 'http://localhost:5001/api/auth/signup';

  signup(data:SignupDto): Observable<any> {
    return this.http.post(this.apiUrl1, data)
  }
  
}
