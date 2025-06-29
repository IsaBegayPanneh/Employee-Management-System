const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const auth = require('../middleware/auth');

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    console.log('GET /employees - Fetching all employees');
    const employees = await Employee.find()
      .populate('department')
      .sort({ hireDate: -1 });
    
    // Transform the data to match frontend expectations
    const transformedEmployees = employees.map(employee => ({
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department ? employee.department.name : 'Unknown',
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    }));
    
    console.log('Returning employees:', transformedEmployees);
    res.json(transformedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single employee
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Transform the data to match frontend expectations
    const transformedEmployee = {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department ? employee.department.name : 'Unknown',
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    };
    
    res.json(transformedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create employee
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating employee with data:', req.body);
    
    // Find department by name instead of ID
    const department = await Department.findOne({ name: req.body.department });
    console.log('Found department:', department);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const employeeData = {
      ...req.body,
      department: department._id
    };
    console.log('Employee data to save:', employeeData);

    const employee = new Employee(employeeData);
    await employee.save();
    
    // Populate department and transform response
    await employee.populate('department');
    const transformedEmployee = {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department ? employee.department.name : 'Unknown',
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    };
    
    console.log('Employee saved successfully:', transformedEmployee);
    res.status(201).json(transformedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update employee
router.put('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Find department by name instead of ID
    const department = await Department.findOne({ name: req.body.department });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    employee.firstName = req.body.firstName || employee.firstName;
    employee.lastName = req.body.lastName || employee.lastName;
    employee.email = req.body.email || employee.email;
    employee.phone = req.body.phone || employee.phone;
    employee.department = department._id;
    employee.position = req.body.position || employee.position;
    employee.hireDate = req.body.hireDate ? new Date(req.body.hireDate) : employee.hireDate;
    employee.status = req.body.status || employee.status;

    await employee.save();
    
    // Populate department and transform response
    await employee.populate('department');
    const transformedEmployee = {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department ? employee.department.name : 'Unknown',
      position: employee.position,
      hireDate: employee.hireDate,
      status: employee.status
    };
    
    res.json(transformedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete employee
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('DELETE /employees/:id - Deleting employee with ID:', req.params.id);
    
    // Validate the ID format
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Invalid employee ID format:', req.params.id);
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      console.log('Employee not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Employee not found' });
    }

    console.log('Found employee to delete:', {
      id: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email
    });
    
    // Use deleteOne instead of remove (which is deprecated)
    const deleteResult = await Employee.deleteOne({ _id: req.params.id });
    
    console.log('Delete result:', deleteResult);
    
    if (deleteResult.deletedCount === 0) {
      console.log('No employee was deleted');
      return res.status(404).json({ message: 'Employee not found or already deleted' });
    }
    
    console.log('Employee deleted successfully');
    res.json({ 
      message: 'Employee deleted successfully',
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid employee ID format' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
