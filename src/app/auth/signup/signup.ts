import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SignupDto } from '../../models/signup.model';


@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  signupForm: FormGroup;
  serverError: string | null = null;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/) // min 8 chars, 1 number, 1 letter
        ]
      ],
      role: ['', Validators.required],
      name: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10,13}$/) // 10–13 digits
        ]
      ],
      city: ['', Validators.required]
    });
  }

  onSubmit() {
    this.serverError = null;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData: SignupDto = this.signupForm.value;

    this.auth.signup(formData).subscribe({
      next: (res) => {
        console.log('Signup success:', res);
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.loading = false;
        this.serverError = err.error?.message || 'Signup failed. Please try again.';
      }
    });
  }

}
