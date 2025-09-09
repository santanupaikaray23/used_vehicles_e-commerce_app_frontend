import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../services/auth';
import { MatMenuPanel } from '@angular/material/menu';
import { userInfoDto } from '../../../models/userinfo.model.dto';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.html',
  styleUrl: './user-header.css'
})
export class UserHeader {
  user: userInfoDto | null = null;

router = inject(Router);
  menu!: MatMenuPanel<any> | null;

  constructor(private auth: Auth) {}

   ngOnInit(): void {
    this.auth.getUserinfo().subscribe({
      next: (res) => (this.user = res),
      error: (err) => console.error('Error fetching profile:', err),
    });
  }

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
