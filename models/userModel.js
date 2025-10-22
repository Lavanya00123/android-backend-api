

const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  userName:{type:String},
  name: { type: String },
  mobileNumber: { type: String },
  
  alternateMobileNumber: { type: String},
  password: { type: String },
  confirmPassword: { type: String},
  branch: { type: String},
  designation: { type: String},

  dateOfBirth: { type: Date},
  address: { type: String},
  joinDate: { type: Date},
  fatherName: { type: String},
  spouseName: { type: String},
  salary:{type:String},
  gender: { type: String},
  ApproveStatus: {
    type: String,
    enum: ['Approved', 'Rejected', 'Pending'],
    default: 'Pending',
  } ,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


