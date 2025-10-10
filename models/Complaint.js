const mongoose = require('mongoose');

// Define Complaint Schema
const ComplaintSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true, 
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export Complaint model
module.exports = mongoose.model('Complaint', ComplaintSchema);
