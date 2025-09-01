import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginDto } from '../../models/login.model.dto';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPage {
  loginForm: FormGroup;
  serverError: string | null = null;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.serverError = null;
    this.loading = true;

    const loginData: LoginDto = this.loginForm.value;
    this.auth.login(loginData).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Login successful:', res);

        if (res.token) {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/dashboard']);  
        }
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err.error?.token || 'Login failed. Please try again.';
      }
    });
  }
}