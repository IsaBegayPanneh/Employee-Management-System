import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface Employee {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  status?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    console.log('EmployeeService: Making GET request to:', `${this.apiUrl}/employees`);
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`).pipe(
      tap(response => {
        console.log('EmployeeService: GET /employees response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: GET /employees error:', error);
        return throwError(() => error);
      })
    );
  }

  getEmployee(id: string): Observable<Employee> {
    console.log('EmployeeService: Making GET request to:', `${this.apiUrl}/employees/${id}`);
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`).pipe(
      tap(response => {
        console.log('EmployeeService: GET /employees/:id response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: GET /employees/:id error:', error);
        return throwError(() => error);
      })
    );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    console.log('EmployeeService: Making POST request to:', `${this.apiUrl}/employees`);
    console.log('EmployeeService: POST data:', employee);
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee).pipe(
      tap(response => {
        console.log('EmployeeService: POST /employees response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: POST /employees error:', error);
        return throwError(() => error);
      })
    );
  }

  updateEmployee(id: string, employee: Employee): Observable<Employee> {
    console.log('EmployeeService: Making PUT request to:', `${this.apiUrl}/employees/${id}`);
    console.log('EmployeeService: PUT data:', employee);
    return this.http.put<Employee>(`${this.apiUrl}/employees/${id}`, employee).pipe(
      tap(response => {
        console.log('EmployeeService: PUT /employees/:id response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: PUT /employees/:id error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteEmployee(id: string): Observable<void> {
    console.log('EmployeeService: Making DELETE request to:', `${this.apiUrl}/employees/${id}`);
    return this.http.delete<void>(`${this.apiUrl}/employees/${id}`).pipe(
      tap(response => {
        console.log('EmployeeService: DELETE /employees/:id response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: DELETE /employees/:id error:', error);
        return throwError(() => error);
      })
    );
  }

  getDepartments(): Observable<string[]> {
    console.log('EmployeeService: Making GET request to:', `${this.apiUrl}/departments`);
    return this.http.get<string[]>(`${this.apiUrl}/departments`).pipe(
      tap(response => {
        console.log('EmployeeService: GET /departments response received:', response);
      }),
      catchError(error => {
        console.error('EmployeeService: GET /departments error:', error);
        return throwError(() => error);
      })
    );
  }
} 