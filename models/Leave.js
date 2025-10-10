// models/Leave.js
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: { // New field for employeeId
    type: String,
    required: true, 
  },
  leaveType: {
    type: String,
    required: true,
    enum: ['Sick', 'Casual', 'Maternity', 'Paternity', 'Vacation', 'Other'], // Customize as needed
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  ApproveStatus: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Approved', 'Rejected'], // Customize as needed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;