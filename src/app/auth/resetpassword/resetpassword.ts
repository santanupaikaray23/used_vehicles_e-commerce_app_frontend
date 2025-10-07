import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-resetpassword',
  standalone: false,
  templateUrl: './resetpassword.html',
  styleUrl: './resetpassword.css'
})
export class Resetpassword {
    resetPasswordForm: FormGroup;
  token: string = '';
  message: string = '';
    hidePassword = true;
    hideConfirmPassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private auth: Auth,
    private router: Router
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword?.setErrors({ mismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  resetPassword() {
    if (this.resetPasswordForm.invalid) {
      this.message = 'Please fill in all fields correctly.';
      return;
    }

    const newPassword = this.resetPasswordForm.get('newPassword')?.value;

    if (!this.token || !newPassword) {
      this.message = 'Token and password are required.';
      return;
    }

    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: (response) => {
        this.message = response.message || 'Password reset successful!';
        alert(this.message);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to reset password.';
        alert(this.message);
      },
    });
  }
}
