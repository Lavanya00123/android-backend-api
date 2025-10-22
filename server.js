require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer
const bodyParser = require('body-parser');
const path = require('path');

const Employee = require('./models/employee');
const { connectToDatabase } = require('./config/db');

// Routes
const attendanceRoutes = require('./routes/attendanceRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const salaryRoutes = require('./routes/SalaryRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Cron + Firebase
const cron = require("node-cron");
const admin = require("./config/firebaseAdmin");


const app = express();
connectToDatabase();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Set up Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route for file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      file: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, // Return accessible file URL
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed', error });
  }
});

// Root route
app.get('/', async (req, res) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/employeeRoutes'));
app.use('/api/attendance', attendanceRoutes);
app.use('/api', complaintRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api', salaryRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint to save call logs for a specific employee
app.post('/api/employees/:employeeId/callLogs', async (req, res) => {
  const { employeeId } = req.params;
  const { callLogs } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (Array.isArray(callLogs)) {
      employee.callLogs.push(...callLogs);
    } else {
      return res.status(400).json({ message: 'Invalid callLogs format. Expected an array.' });
    }

    await employee.save();
    res.status(200).json({ message: 'Call logs saved successfully!' });
  } catch (error) {
    console.error('Error saving call logs:', error);
    res.status(500).json({ message: 'Error saving call logs', error });
  }
});

// Endpoint to save messages for a specific employee
app.post('/api/employees/:employeeId/messages', async (req, res) => {
  const { employeeId } = req.params;
  const { messages } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (Array.isArray(messages)) {
      employee.messages.push(...messages);
    } else {
      return res.status(400).json({ message: 'Invalid messages format. Expected an array.' });
    }

    await employee.save();
    res.status(200).json({ message: 'Messages saved successfully!' });
  } catch (error) {
    console.error('Error saving messages:', error);
    res.status(500).json({ message: 'Error saving messages', error });
  }
});


// Endpoint to get call logs for a specific employee
app.get('/api/employees/:employeeId/callLogs', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId }, 'callLogs');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ callLogs: employee.callLogs });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    res.status(500).json({ message: 'Error fetching call logs', error });
  }
});


// Endpoint to get messages for a specific employee
app.get('/api/employees/:employeeId/messages', async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId }, 'messages');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ messages: employee.messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error });
  }
});

// Endpoint to get all employees with call logs and messages
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find({})
      .select('employeeId name callLogs messages');
    res.status(200).json({ employees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});



// Cron: every day at 7 AM
cron.schedule("0 7 * * *", async () => {
  console.log("Sending daily attendance check...");
  try {
    const employees = await Employee.find({ fcmToken: { $exists: true } });
    for (let emp of employees) {
      if (emp.fcmToken) {
        await admin.messaging().send({
          token: emp.fcmToken,
          notification: {
            title: "Daily Attendance",
            body: "Are you coming to work today?",
          },
          data: { type: "attendance_check" }
        });
        console.log(`Notification sent to ${emp.employeeId}`);
      }
    }
  } catch (err) {
    console.error("Error sending notifications:", err);
  }
});



// 🔹 TEST ENDPOINT → Manually send notification
app.get("/api/attendance/sendTestNotification/:employeeId", async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });

    if (!employee || !employee.fcmToken) {
      return res.status(404).json({ message: "No FCM token found for this employee" });
    }

    const message = {
      token: employee.fcmToken,
      notification: {
        title: "Attendance Check (Test)",
        body: "Will you come to work today?",
      },
      data: { type: "attendance_check" },
    };

    const response = await admin.messaging().send(message);
    console.log("✅ Test Notification sent:", response);

    res.json({ message: "Notification sent successfully", response });
  } catch (error) {
    console.error("🔥 Error sending test notification:", error);
    res.status(500).json({ message: "Error sending notification", error });
  }
});

app.post("/api/employees/update-token", async (req, res) => {
  const { employeeId, fcmToken } = req.body;
  try {
    const employee = await Employee.findOneAndUpdate(
      { employeeId },
      { fcmToken },
      { new: true }
    );
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "✅ FCM token updated", employee });
  } catch (err) {
    console.error(" ❌ Error updating token:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Test notification route
app.post("/api/test-notification", async (req, res) => {
  const { employeeId } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId });
    if (!employee || !employee.fcmToken) {
      return res.status(404).json({ message: "Employee not found or no FCM token" });
    }

    const message = {
      token: employee.fcmToken,
      notification: {
        title: "🚀 Test Notification",
        body: "This is a test push from Postman!"
      },
      data: { type: "attendance_check" }
    };

    await admin.messaging().send(message);

    res.json({ message: "✅ Test notification sent", employeeId });
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});







// 🔹 Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running at ${PORT}`)
);

