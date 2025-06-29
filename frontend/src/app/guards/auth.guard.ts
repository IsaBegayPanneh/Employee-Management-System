import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('AuthGuard: Checking authentication...');
  
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();
  const isLoggedIn = authService.isLoggedIn();
  const currentUser = authService.getCurrentUser();
  
  console.log('AuthGuard: isAuthenticated:', isAuthenticated);
  console.log('AuthGuard: isLoggedIn:', isLoggedIn);
  console.log('AuthGuard: currentUser:', currentUser);

  if (isAuthenticated && isLoggedIn && currentUser) {
    console.log('AuthGuard: User is authenticated, allowing access');
    return true;
  }

  console.log('AuthGuard: User is not authenticated, redirecting to login');
  router.navigate(['/login']);
  return false;
}; 