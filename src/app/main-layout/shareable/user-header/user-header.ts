import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { MatMenuPanel } from '@angular/material/menu';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.html',
  styleUrl: './user-header.css'
})
export class UserHeader {
router = inject(Router);
  menu!: MatMenuPanel<any> | null;

  constructor(private auth: Auth) {}

  logout() {
    const tokenKey = 'authToken'; 
    // this.auth.clearToken(tokenKey); 
    this.router.navigate(['/login']); 
  }



}
