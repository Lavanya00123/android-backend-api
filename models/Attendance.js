// const mongoose = require('mongoose');
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
  },
  AttendanceStatus: {
    isPresent: {
      type: Boolean,
      required: true,
    },
    isLeave: {
      type: Boolean,
      required: true,
    },
    isHalfDay: {
      type: Boolean,
      required: true,
    },
  },
  location: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  locationName: {
    type: String,
    // required: true, // Uncomment if you want to make this field required
  },
  time: {
    type: Date,
    default: Date.now,
    required: true,
  },
photoUri: {  // New field for storing the image
    type: String,
    required: true, // Set to true if the image is mandatory
  },
});

const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance;
