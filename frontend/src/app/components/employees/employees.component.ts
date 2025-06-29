import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  departments: string[] = [];
  employeeForm: FormGroup;
  isEditing = false;
  selectedEmployeeId: string | null = null;
  errorMessage = '';
  successMessage = '';
  isLoading = false;

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
    console.log('Employees component initialized');

    if (!this.authService.isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.loadDepartments();
    this.loadEmployees();
  }

  loadEmployees(): void {
    console.log('=== LOAD EMPLOYEES START ===');
    console.log('Initial loading state:', this.isLoading);
    
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Loading employees...');
    console.log('Auth token:', localStorage.getItem('currentUser'));
    console.log('Loading state after setting to true:', this.isLoading);
    
    // Force change detection
    this.cdr.detectChanges();
    
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        console.log('=== EMPLOYEES LOADED SUCCESSFULLY ===');
        this.employees = employees;
        this.isLoading = false;
        console.log('Employees loaded successfully:', employees);
        console.log('Loading state set to:', this.isLoading);
        console.log('Employees array length:', this.employees.length);
        
        // Force change detection
        this.cdr.detectChanges();
        console.log('Change detection triggered');
      },
      error: (error) => {
        console.error('=== ERROR LOADING EMPLOYEES ===');
        console.error('Error loading employees:', error);
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
        console.log('Loading state set to (error):', this.isLoading);
        
        // Force change detection
        this.cdr.detectChanges();
      }
    });
  }

  loadDepartments(): void {
    this.employeeService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        console.log('Departments loaded:', departments);
      },
      error: () => {
        console.warn('Failed to load departments. Using default values.');
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
    console.log('=== DELETE EMPLOYEE START ===');
    console.log('Deleting employee with ID:', employeeId);
    
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log('User confirmed deletion, making API call...');
      
      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: (response) => {
          console.log('=== DELETE EMPLOYEE SUCCESS ===');
          console.log('Delete response:', response);
          this.successMessage = 'Employee deleted successfully!';
          this.loadEmployees();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('=== DELETE EMPLOYEE ERROR ===');
          console.error('Delete error:', error);
          this.errorMessage = error.error?.message || 'Failed to delete employee.';
          console.log('Error message set to:', this.errorMessage);
        }
      });
    } else {
      console.log('User cancelled deletion');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
