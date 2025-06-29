import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  employees: Employee[] = [];
  departments: string[] = [];
  errorMessage = '';
  isLoading = false;
  currentUser: any;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is HR
    if (this.currentUser?.role !== 'hr') {
      this.router.navigate(['/unauthorized']);
      return;
    }

    this.loadDepartments();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();
    
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check if the backend server is running.';
        } else if (error.status === 401) {
          this.errorMessage = 'Authentication failed. Please login again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = 'Failed to load employees: ' + (error.error?.message || error.message || 'Unknown error');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: () => {
        this.departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getEmployeesByDepartment(department: string): Employee[] {
    return this.employees.filter(emp => emp.department === department);
  }

  getDepartmentStats() {
    const stats: { [key: string]: number } = {};
    this.departments.forEach(dept => {
      stats[dept] = this.getEmployeesByDepartment(dept).length;
    });
    return stats;
  }
} 