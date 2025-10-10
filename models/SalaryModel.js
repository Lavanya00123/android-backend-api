const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  basicSalary: {
    type: Number,
    required: true,
    default: 50000,
  },
  perDaySalary: {
    type: Number,
    required: true,
  },
  noOfLeaves: {
    type: Number,
    required: true,
    default: 0,
  },
  advanceSalary: {
    type: Number,
    required: true,
    default: 0,
  },
  deductedSalary: {
    type: Number,
    required: true,
  },
  actualSalary: {
    type: Number,
    required: true,
  },
});

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
