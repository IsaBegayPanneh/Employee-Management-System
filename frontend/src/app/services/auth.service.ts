import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError, of, timeout } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private readonly apiUrl = 'http://localhost:3000/api';
  private platformId = inject(PLATFORM_ID);
  private isInitialized = false;

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user && user.token) {
            console.log('AuthService: Loading user from localStorage:', user);
            this.currentUser.set(user);
            
            // Validate the token with the backend
            this.validateToken().subscribe(isValid => {
              if (!isValid) {
                console.log('AuthService: Stored token is invalid, clearing user');
                this.logout();
              } else {
                console.log('AuthService: Stored token is valid');
              }
            });
          } else {
            console.log('AuthService: Invalid user data in localStorage, clearing');
            localStorage.removeItem('currentUser');
          }
        } else {
          console.log('AuthService: No user found in localStorage');
        }
      } catch (error) {
        console.error('AuthService: Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
      this.isInitialized = true;
    }
  }

  getCurrentUser() {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    const user = this.currentUser();
    console.log('AuthService: isLoggedIn check - user:', user);
    return user !== null && user.token !== null;
  }

  isAuthenticated(): boolean {
    // Wait for initialization
    if (!this.isInitialized && isPlatformBrowser(this.platformId)) {
      console.log('AuthService: Not initialized yet, checking localStorage directly');
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          return user && user.token;
        }
      } catch {
        return false;
      }
    }

    const user = this.currentUser();
    console.log('AuthService: isAuthenticated check - user:', user);
    
    if (!user || !user.token) {
      return false;
    }
    
    // Double-check localStorage
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedUser = localStorage.getItem('currentUser');
        if (!savedUser) {
          console.log('AuthService: No user in localStorage, clearing current user');
          this.currentUser.set(null);
          return false;
        }
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser || !parsedUser.token) {
          console.log('AuthService: Invalid user in localStorage, clearing');
          this.currentUser.set(null);
          localStorage.removeItem('currentUser');
          return false;
        }
        return true;
      } catch (error) {
        console.error('AuthService: Error checking localStorage:', error);
        this.currentUser.set(null);
        localStorage.removeItem('currentUser');
        return false;
      }
    }
    
    return true;
  }

  validateToken(): Observable<boolean> {
    const user = this.currentUser();
    if (!user || !user.token) {
      return of(false);
    }

    return this.http.get(`${this.apiUrl}/auth/validate`, { 
      headers: { Authorization: `Bearer ${user.token}` } 
    }).pipe(
      map(() => true),
      catchError((error) => {
        console.log('AuthService: Token validation failed:', error);
        if (error.status === 401) {
          // Token is invalid
          this.logout();
        } else if (error.status === 0 || error.status === 500) {
          // Network error or server error - don't logout, just return false
          console.log('AuthService: Network/server error during token validation');
        }
        return of(false);
      })
    );
  }

  checkBackendHealth(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      timeout(10000), // 10 second timeout
      map(response => {
        const userWithToken = {
          ...response.user,
          token: response.token
        };
        this.currentUser.set(userWithToken);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(userWithToken));
        }
        return userWithToken;
      }),
      catchError((error) => {
        // Handle timeout errors
        if (error.name === 'TimeoutError') {
          const timeoutError = {
            status: 0,
            message: 'Request timed out. Please check your connection and try again.',
            error: { message: 'Request timed out' }
          };
          return throwError(() => timeoutError);
        }
        
        // Format the error response
        const errorMessage = error.error?.message || 'An error occurred during login';
        const errorStatus = error.status || 500;
        
        // Create a properly formatted error object
        const formattedError = {
          status: errorStatus,
          message: errorMessage,
          error: error.error
        };
        
        return throwError(() => formattedError);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
  }

  register(userData: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }
}
