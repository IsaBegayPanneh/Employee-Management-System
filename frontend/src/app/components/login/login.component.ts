import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  isLoginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.isLoginError = false;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.redirectToRoleDashboard(response.role);
        },
        error: (error) => {
          this.isLoading = false;
          this.isLoginError = true;

          // The auth service formats the error and puts the message in error.message
          if (error.status === 401) {
            this.errorMessage = error.message || 'Invalid email or password. Please try again.';
          } else if (error.status === 0) {
            this.errorMessage = 'Unable to connect to server. Please check your connection.';
          } else if (error.message) {
            this.errorMessage = error.message;
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
          
          // Force change detection to ensure UI updates
          this.cdr.detectChanges();
        }
      });
    } else {
      this.isLoginError = false;
      this.markFormGroupTouched();
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  private redirectToRoleDashboard(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'hr':
        this.router.navigate(['/hr']);
        break;
      case 'manager':
        this.router.navigate(['/manager']);
        break;
      default:
        // Fallback to employees page for unknown roles
        this.router.navigate(['/employees']);
        break;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  onInputChange(): void {
    if (this.errorMessage && !this.isLoginError) {
      this.errorMessage = '';
      this.isLoginError = false;
    }
  }
}
