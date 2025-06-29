import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Don't add Authorization header for login requests
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
  
  // Get token from localStorage
  const token = localStorage.getItem('currentUser') ? 
    JSON.parse(localStorage.getItem('currentUser')!).token : null;

  // Clone the request and add the authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
}; 