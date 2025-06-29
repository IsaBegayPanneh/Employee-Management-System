import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent {
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  goToLogin(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToDashboard(): void {
    if (this.currentUser?.role) {
      switch (this.currentUser.role) {
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
          this.router.navigate(['/employees']);
          break;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
} 