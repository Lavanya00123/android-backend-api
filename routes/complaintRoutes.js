const express = require('express');
const {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  getComplaintsByEmployeeId,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');

const router = express.Router();

// POST - Create a new complaint
router.post('/complaints', createComplaint);

// GET - Retrieve all complaints
router.get('/complaints', getAllComplaints);

// GET - Retrieve complaints by employeeId
router.get('/complaints/employee/:employeeId', getComplaintsByEmployeeId);

// PUT - Update a complaint by ID
router.put('/complaints/:id', updateComplaint);

// DELETE - Delete a complaint by ID
router.delete('/complaints/:id', deleteComplaint);

module.exports = router;
