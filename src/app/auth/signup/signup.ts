import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { SignupDto } from '../../models/signup.model.dto';


@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
   selectedFileName: string = '';
  signupForm: FormGroup;
  serverError: string | null = null;
  previewUrl: string | null = null;
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
      name: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10,13}$/) 
        ]
      ],
      city: ['', Validators.required],
          role: ['', Validators.required],
            avatar_url: ['', Validators.required],
       
    });
  }

  onSubmit() {
    this.serverError = null;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;
   const formData: SignupDto = {
    ...this.signupForm.value,
     created_at: new Date().toISOString(),
     updated_at: new Date().toISOString()
  };

  console.log("form data", formData)

    this.auth.signup(formData).subscribe({
      next: (res) => {
        console.log('Signup success');
        alert(res.message); 
        this.router.navigate(['/login']);
      },
    error: (err) => {
  console.error('Signup failed.', err);

  let errorMessage = 'An unexpected error occurred. Please try again.';

  if (err.status === 413) {
    errorMessage = 'Upload failed: The image size is too large.';
  } else if (err.error?.message) {
    errorMessage = err.error.message;
  }

  this.serverError = errorMessage;
}
    });
  }
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.selectedFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string; 
      this.signupForm.patchValue({ avatar_url: reader.result as string });
    };
    reader.readAsDataURL(file); 
  }
}
}
