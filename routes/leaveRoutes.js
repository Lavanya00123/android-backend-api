// routes/leaveRoutes.js
const express = require('express');
const {
  createLeave,
  getLeaves,
  getLeavesByEmployeeId, // Add this import
  getLeaveById,
  updateLeave,
  deleteLeave,
} = require('../controllers/leaveController');

const router = express.Router();

// @route   POST /api/leaves
router.post('/Leaves', createLeave);

// @route   GET /api/leaves
router.get('/', getLeaves); 

// @route   GET /api/leaves/employee/:employeeId
router.get('/employee/:employeeId', getLeavesByEmployeeId); // New route for fetching leaves by employeeId 

// @route   GET /api/leaves/:id
router.get('/:id', getLeaveById); 

// @route   PUT /api/leaves/:id
router.put('/Leaves/:id', updateLeave);

// @route   DELETE /api/leaves/:id
router.delete('/Leaves/:id', deleteLeave);

module.exports = router;  