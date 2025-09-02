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

 onLogout() {
  this.auth.logout().subscribe({
    next: (res) => {
      console.log('Logged out');
      localStorage.removeItem('token');  
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Logout failed');
    }
  });
}
}
