import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {   // ✅ Capital G + implements CanActivate
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true; // ✅ allow navigation
    } else {
      this.router.navigate(['/login']); // ❌ block and redirect
      return false;
    }
  }
}