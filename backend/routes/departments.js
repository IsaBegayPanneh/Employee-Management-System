const express = require('express');
const router = express.Router();

// Example departments list
const departments = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'IT',
  'Customer Support'
];

// GET /api/departments
router.get('/', (req, res) => {
  res.json(departments);
});

module.exports = router; 