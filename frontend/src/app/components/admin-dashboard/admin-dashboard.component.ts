import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  employees: Employee[] = [];
  departments: string[] = [];
  employeeForm: FormGroup;
  isEditing = false;
  selectedEmployeeId: string | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  currentUser: any;

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      department: ['', [Validators.required]],
      position: ['', [Validators.required]],
      hireDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is admin
    if (this.currentUser?.role !== 'admin') {
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

  openAddModal(content: any): void {
    this.isEditing = false;
    this.selectedEmployeeId = null;
    this.employeeForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
    this.modalService.open(content, { size: 'lg' });
  }

  openEditModal(content: any, employee: Employee): void {
    this.isEditing = true;
    this.selectedEmployeeId = employee._id!;
    this.employeeForm.patchValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : ''
    });
    this.errorMessage = '';
    this.successMessage = '';
    this.modalService.open(content, { size: 'lg' });
  }

  onSubmit(modal: any): void {
    if (this.employeeForm.valid) {
      const employeeData = this.employeeForm.value;

      if (this.isEditing && this.selectedEmployeeId) {
        this.employeeService.updateEmployee(this.selectedEmployeeId, employeeData).subscribe({
          next: () => {
            this.successMessage = 'Employee updated successfully!';
            this.loadEmployees();
            modal.close();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to update employee.';
          }
        });
      } else {
        this.employeeService.createEmployee(employeeData).subscribe({
          next: () => {
            this.successMessage = 'Employee created successfully!';
            this.loadEmployees();
            modal.close();
            setTimeout(() => this.successMessage = '', 3000);
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Failed to create employee.';
          }
        });
      }
    } else {
      this.errorMessage = 'Please fill in all required fields correctly.';
    }
  }

  deleteEmployee(employeeId: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.successMessage = 'Employee deleted successfully!';
          this.loadEmployees();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Failed to delete employee.';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 