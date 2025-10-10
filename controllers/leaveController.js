// controllers/leaveController.js
const Leave = require('../models/Leave');

// @desc    Create a new leave application
exports.createLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, employeeId,ApproveStatus } = req.body;

    // Validate input
    if (!leaveType || !startDate || !endDate || !reason || !employeeId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new leave application
    const newLeave = new Leave({
      leaveType,
      startDate,
      endDate,
      reason,
      employeeId, // Include employeeId in the new leave application
      ApproveStatus,
    });

    const savedLeave = await newLeave.save();
    res.status(201).json(savedLeave);
  } catch (error) {
    console.error('Error creating leave:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get all leave applications
exports.getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get leave applications by employeeId
exports.getLeavesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from request parameters

    // Fetch leave applications by employeeId
    const leaves = await Leave.find({ employeeId });
    
    if (leaves.length === 0) {
      return res.status(404).json({ message: 'No leave applications found for this employee.' });
    }

    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leaves by employeeId:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Get a single leave application by ID
exports.getLeaveById = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }
    res.status(200).json(leave);
  } catch (error) {
    console.error('Error fetching leave application:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


exports.getLeavesByEmployeeId = async (req, res) => {
  try {
    const leaves = await Leave.find({ employeeId: req.params.employeeId });
    if (leaves.length === 0) {
      return res.status(404).json({ message: 'No leave applications found for this employee.' });
    }
    res.status(200).json(leaves);
  } catch (error) {
    console.error('Error fetching leave applications:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


// @desc    Update a leave application by ID
exports.updateLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Find leave by ID
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    // Update fields
    leave.leaveType = leaveType || leave.leaveType;
    leave.startDate = startDate || leave.startDate;
    leave.endDate = endDate || leave.endDate;
    leave.reason = reason || leave.reason;

    const updatedLeave = await leave.save();
    res.status(200).json(updatedLeave);
  } catch (error) {
    console.error('Error updating leave application:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// @desc    Delete a leave application by ID
exports.deleteLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave application not found' });
    }

    await leave.remove();
    res.status(200).json({ message: 'Leave application deleted successfully' });
  } catch (error) {
    console.error('Error deleting leave application:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};