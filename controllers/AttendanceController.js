
// const Attendance = require('../models/Attendance');
// const Attendance = require('../models/Attendance');
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Specify your upload directory

// // POST request to save attendance
// exports.addAttendance = async (req, res) => {
//   const { employeeId, location, locationName, AttendanceStatus, photoUri } = req.body;

//   try {
//     // Ensure the received AttendanceStatus object has the expected structure
//     const newAttendance = new Attendance({
//       employeeId,
//       location,
//       locationName,
//       AttendanceStatus: { 
//         isPresent: AttendanceStatus.isPresent,
//         isLeave: AttendanceStatus.isLeave,
//         isHalfDay: AttendanceStatus.isHalfDay,
//       },
//       photoUri, // Include the captured image URL
//     });

//     await newAttendance.save();
//     res.status(201).json({ message: 'Attendance recorded successfully!', attendance: newAttendance });
//   } catch (error) {
//     console.error('Error recording attendance:', error);
//     res.status(500).json({ message: 'Error recording attendance' });
//   }
// };




const Attendance = require('../models/Attendance');
const multer = require('multer');
const path = require('path');
const Employee = require("../models/employee");
const admin = require("../config/firebaseAdmin"); // make sure this is set up

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Specify your upload directory
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// POST request to save attendance
exports.addAttendance = [
  upload.single('photo'), // Middleware to handle file upload
  async (req, res) => {
    const { employeeId, latitude, longitude, locationName, AttendanceStatus } = req.body;

    try {
      // Check if a file was uploaded
      let photoUri = '';
      if (req.file) {
        console.log('File uploaded:', req.file);
        photoUri = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`; // Generate public URL for the uploaded file
      }

      // Ensure the received AttendanceStatus object has the expected structure
      const newAttendance = new Attendance({
        employeeId,
        location: {
          latitude: parseFloat(latitude), // Convert to number
          longitude: parseFloat(longitude), // Convert to number
        },
        locationName,
        AttendanceStatus: JSON.parse(AttendanceStatus), // Parse JSON string
        photoUri, // Include the captured image URL or local file URL
      });

      await newAttendance.save();
      res.status(201).json({ message: 'Attendance recorded successfully!', attendance: newAttendance });
    } catch (error) {
      console.error('Error recording attendance:', error);
      res.status(500).json({ message: 'Error recording attendance' });
    }
  },
];




// GET request to fetch attendance records by employeeId
exports.getAttendanceByEmployeeId = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const records = await Attendance.find({ employeeId });
    if (records.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this employee.' });
    }
    res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Error fetching attendance records' });
  }
};

// PUT request to update attendance by employeeId and time
exports.updateAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const { AttendanceStatus, location, locationName, time } = req.body;

  try {
    // Ensure the time is a valid Date object
    const attendanceTime = new Date(time);
    
    // Get start and end of the day to match the date
    const startOfDay = new Date(attendanceTime.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(attendanceTime.setUTCHours(23, 59, 59, 999));

    // Update the attendance record if found within the day range
    const updatedAttendance = await Attendance.findOneAndUpdate(
      {
        employeeId,
        time: { $gte: startOfDay, $lte: endOfDay } // Match the time within the day
      },
      { AttendanceStatus, location, locationName },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record updated successfully', attendance: updatedAttendance });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ message: 'Error updating attendance record' });
  }
};

// DELETE request to delete attendance by employeeId and time
exports.deleteAttendance = async (req, res) => {
  const { employeeId } = req.params;
  const { time } = req.body;

  try {
    const attendanceTime = new Date(time);
    
    // Get start and end of the day for matching the date
    const startOfDay = new Date(attendanceTime.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(attendanceTime.setUTCHours(23, 59, 59, 999));

    const deletedAttendance = await Attendance.findOneAndDelete({
      employeeId,
      time: { $gte: startOfDay, $lte: endOfDay } // Match the time within the day
    });

    if (!deletedAttendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ message: 'Error deleting attendance record' });
  }
};



// Save FCM token
exports.saveFcmToken = async (req, res) => {
  const { employeeId } = req.params;
  const { token } = req.body;
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { fcmToken: token },
      { new: true, upsert: true }
    );
    res.json({ message: "Token saved", employee });
  } catch (err) {
    res.status(500).json({ message: "Error saving token", err });
  }
};

// Save attendance reply
exports.saveAttendanceReply = async (req, res) => {
  const { employeeId } = req.params;
  const { reply } = req.body;
  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.attendanceReplies.push({ reply, date: new Date() });
    await employee.save();

    res.json({ message: "Reply saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error saving reply", err });
  }
};

// Get today's replies
exports.getTodayAttendance = async (req, res) => {
  const today = new Date().setHours(0, 0, 0, 0);
  try {
    const employees = await Employee.find({});
    const report = employees.map(emp => {
      const todayReply = emp.attendanceReplies.find(r =>
        new Date(r.date).setHours(0, 0, 0, 0) === today
      );
      return {
        employeeId: emp.employeeId,
        name: emp.name,
        reply: todayReply ? todayReply.reply : "no response"
      };
    });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Error fetching replies", err });
  }
};


//test messages
exports.sendTestNotification = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee || !employee.fcmToken) {
      return res.status(404).json({ message: "Employee or FCM token not found" });
    }

    const message = {
      token: employee.fcmToken,
      notification: {
        title: "Daily Attendance",
        body: "Will you come to office today?"
      },
      data: { type: "attendance_check" }
    };

    const response = await admin.messaging().send(message);
    res.json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Error sending notification", error });
  }
};