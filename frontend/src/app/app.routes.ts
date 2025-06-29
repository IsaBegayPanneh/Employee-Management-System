import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { ManagerDashboardComponent } from './components/manager-dashboard/manager-dashboard.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'hr', component: HrDashboardComponent, canActivate: [authGuard] },
  { path: 'manager', component: ManagerDashboardComponent, canActivate: [authGuard] },
  { path: 'employees', component: EmployeesComponent, canActivate: [authGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
