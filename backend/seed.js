const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Department = require('./models/Department');
const Employee = require('./models/Employee');

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/employee_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected for seeding'))
.catch(err => console.error('MongoDB connection error:', err));

// Test users data
const users = [
  {
    username: 'admin',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'hr',
    email: 'hr@company.com',
    password: 'hr@2024',
    role: 'hr'
  },
  {
    username: 'manager',
    email: 'manager@company.com',
    password: 'manager123',
    role: 'manager'
  },
  {
    username: 'jane.smith',
    email: 'jane.smith@company.com',
    password: 'password123',
    role: 'manager'
  }
];

// Departments data
const departments = [
  {
    name: 'Engineering',
    description: 'Software development and technical operations'
  },
  {
    name: 'Human Resources',
    description: 'HR management and employee relations'
  },
  {
    name: 'Finance',
    description: 'Financial planning and accounting'
  },
  {
    name: 'Marketing',
    description: 'Marketing and communications'
  },
  {
    name: 'Sales',
    description: 'Sales and business development'
  },
  {
    name: 'IT',
    description: 'Information technology and infrastructure'
  },
  {
    name: 'Customer Support',
    description: 'Customer service and support'
  }
];

// Employees data (will be populated after departments)
const employees = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0101',
    position: 'Senior Software Engineer',
    hireDate: new Date('2022-01-15'),
    status: 'active'
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0102',
    position: 'HR Manager',
    hireDate: new Date('2021-06-20'),
    status: 'active'
  },
  {
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1-555-0103',
    position: 'Financial Analyst',
    hireDate: new Date('2022-03-10'),
    status: 'active'
  },
  {
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@company.com',
    phone: '+1-555-0104',
    position: 'Marketing Specialist',
    hireDate: new Date('2022-08-05'),
    status: 'active'
  },
  {
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    phone: '+1-555-0105',
    position: 'Sales Representative',
    hireDate: new Date('2021-11-12'),
    status: 'active'
  },
  {
    firstName: 'Lisa',
    lastName: 'Davis',
    email: 'lisa.davis@company.com',
    phone: '+1-555-0106',
    position: 'IT Support Specialist',
    hireDate: new Date('2022-02-28'),
    status: 'active'
  },
  {
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@company.com',
    phone: '+1-555-0107',
    position: 'Customer Success Manager',
    hireDate: new Date('2021-09-15'),
    status: 'active'
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Employee.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create departments
    console.log('Creating departments...');
    const createdDepartments = [];
    for (const deptData of departments) {
      const department = new Department(deptData);
      await department.save();
      createdDepartments.push(department);
      console.log(`Created department: ${department.name}`);
    }

    // Create employees with department references
    console.log('Creating employees...');
    const departmentNames = ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Sales', 'IT', 'Customer Support'];
    
    for (let i = 0; i < employees.length; i++) {
      const employeeData = employees[i];
      const departmentName = departmentNames[i % departmentNames.length];
      const department = createdDepartments.find(d => d.name === departmentName);
      
      const employee = new Employee({
        ...employeeData,
        department: department._id
      });
      
      await employee.save();
      console.log(`Created employee: ${employee.firstName} ${employee.lastName} in ${departmentName}`);
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach(user => {
      console.log(`👤 ${user.role.toUpperCase()}:`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Email: ${user.email}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Created ${createdUsers.length} users, ${createdDepartments.length} departments, and ${employees.length} employees`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding
seedDatabase(); 