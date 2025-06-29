const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Department = require('./models/Department');

mongoose.connect('mongodb://localhost:27017/employee_management')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Test department lookup
      const department = await Department.findOne({ name: 'Engineering' });
      console.log('Found department:', department);
      
      if (!department) {
        console.log('Department not found!');
        return;
      }
      
      // Test employee creation
      const employeeData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '1234567890',
        department: department._id,
        position: 'Developer',
        hireDate: new Date('2024-01-01')
      };
      
      console.log('Creating employee with data:', employeeData);
      
      const employee = new Employee(employeeData);
      await employee.save();
      
      console.log('Employee created successfully:', employee);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 