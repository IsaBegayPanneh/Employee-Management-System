# Employee Management System

A full-stack Employee Management System with role-based dashboards built with Node.js, Express, MongoDB backend and Angular 17 frontend.

## 🚀 Features

### Role-Based Access Control
- **Admin Dashboard**: Full CRUD operations (Create, Read, Update, Delete employees)
- **HR Dashboard**: View-only access with department analytics
- **Manager Dashboard**: Edit-only access (can update but not add/delete employees)

### Modern UI/UX
- Glassmorphism design with gradient backgrounds
- Responsive layout for all devices
- Interactive animations and hover effects
- Real-time statistics and department overviews

### Security
- JWT-based authentication
- Role-based route protection
- Password hashing with bcrypt
- HTTP-only cookies for session management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **Angular 17** - Frontend framework
- **TypeScript** - Programming language
- **Angular Material** - UI components
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Employee-Management
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Create environment file
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your-secret-key-here
PORT=3000
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🗄️ Database Setup

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Seed the database
```bash
cd backend
node seed.js
```

This will create:
- 4 users with different roles
- 7 departments
- 7 sample employees

## 🏃‍♂️ Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:3000`

### 2. Start the Frontend Application
```bash
cd frontend
ng serve
```
The frontend will run on `http://localhost:4200`

## 👥 Test Users

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Admin** | `admin@company.com` | `admin123` | `/admin` |
| **HR** | `hr@company.com` | `hr@2024` | `/hr` |
| **Manager** | `manager@company.com` | `manager123` | `/manager` |
| **Manager** | `jane.smith@company.com` | `password123` | `/manager` |

## 📊 Role Permissions

### Admin Dashboard (`/admin`)
- ✅ Create new employees
- ✅ View all employees
- ✅ Edit employee information
- ✅ Delete employees
- ✅ Full department management
- ✅ Complete system control

### HR Dashboard (`/hr`)
- ❌ Create employees
- ✅ View all employees
- ❌ Edit employee information
- ❌ Delete employees
- ✅ Department analytics
- ✅ Employee overview and statistics

### Manager Dashboard (`/manager`)
- ❌ Create employees
- ✅ View all employees
- ✅ Edit employee information
- ❌ Delete employees
- ✅ Department overview
- ✅ Limited management capabilities

## 🏗️ Project Structure

```
Employee Management/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   └── Department.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── employees.js
│   │   └── departments.js
│   ├── middleware/
│   │   └── auth.js
│   ├── seed.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   ├── hr-dashboard/
│   │   │   │   ├── manager-dashboard/
│   │   │   │   ├── employees/
│   │   │   │   └── unauthorized/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   │   └── app.routes.ts
│   │   └── main.ts
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/validate` - Validate JWT token

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments

## 🎨 UI Components

### Dashboard Features
- **Statistics Cards**: Employee count, department count, permissions
- **Department Overview**: Employee distribution across departments
- **Employee Table**: Sortable and searchable employee list
- **Modal Forms**: Add/Edit employee forms
- **Responsive Design**: Works on desktop, tablet, and mobile

### Design Elements
- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradient Backgrounds**: Purple to blue gradients
- **Hover Animations**: Smooth transitions and effects
- **Color-coded Roles**: Different colors for different user roles
- **Modern Icons**: SVG icons throughout the interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different roles
- **Password Hashing**: Bcrypt encryption for passwords
- **Route Protection**: Guards prevent unauthorized access
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin settings

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure MongoDB connection
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `ng build --prod`
2. Deploy the `dist` folder to your hosting service
3. Configure API endpoint URLs


