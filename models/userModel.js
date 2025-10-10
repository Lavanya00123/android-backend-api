// // models/userModel.js
// const mongoose = require('mongoose');
// const userSchema = new mongoose.Schema({
//   employeeId: { type: String, required: true, unique: true },
//   userName:{type:String,required:true,unique:true},
//   name: { type: String, required: true },
//   mobileNumber: { type: String, required: true },
  
//   alternateMobileNumber: { type: String},
//   password: { type: String, required: true },
//   confirmPassword: { type: String, required: true},
//   branch: { type: String, required: true},
//   designation: { type: String},

//   dateOfBirth: { type: Date, required: true},
//   address: { type: String, required: true},
//   joinDate: { type: Date, required: true},
//   fatherName: { type: String, required: true},
//   spouseName: { type: String, required: true},
//   salary:{type:String},
//   gender: { type: String},
//   ApproveStatus: {
//     type: String,
//     enum: ['Approved', 'Rejected', 'Pending'],
//     default: 'Pending',
//   } ,
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);



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


