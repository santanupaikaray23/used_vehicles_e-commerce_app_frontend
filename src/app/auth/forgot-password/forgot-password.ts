import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  forgotPasswordForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private auth: Auth,
    private router: Router,
    private location: Location
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
onSubmit(): void {
  if (this.forgotPasswordForm.invalid) return;

  this.isLoading = true; 
  const email = this.forgotPasswordForm.value.email;

  this.auth.forgotPassword(email).subscribe({
    next: (res) => {
      alert(res.message || 'Password reset email sent successfully');
      this.isLoading = false; 
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Error:', err);
      alert(err.error?.message || 'Something went wrong. Please try again.');
      this.isLoading = false; 
    },
  });
}
  goBack(): void {
    this.location.back();
  }
  }


