// const express = require("express");
// const router = express.Router();
// const AttendanceController = require("../controllers/AttendanceController");
// const multer = require("multer");
// const upload = multer({ dest: "uploads/" }); // Specify your upload directory

// // Route to add attendance
// router.post("/add", AttendanceController.addAttendance);

// router.post("/api/upload/photo", upload.single("photo"), (req, res) => {
//   // Handle the uploaded file
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }
//   // Proceed with your logic (e.g., save file path to database)
//   res.send({ message: "File uploaded successfully." });
// });

// //new requirement
// router.post("/:employeeId/fcmToken", AttendanceController.saveFcmToken);

// router.post(
//   "/:employeeId/attendanceReply",AttendanceController.saveAttendanceReply
// );
// // Route to get attendance by employeeId
// router.get("/:employeeId", AttendanceController.getAttendanceByEmployeeId);

// // new requirement
// router.get("/today", AttendanceController.getTodayAttendance);

// // Route to update attendance by employeeId and time
// router.put("/:employeeId/update", AttendanceController.updateAttendance);

// // Route to delete attendance by employeeId and time
// router.delete("/:employeeId/delete", AttendanceController.deleteAttendance);

// // New requirement - Send test notification
// router.post(
//   "/sendTestNotification/:employeeId",
//   AttendanceController.sendTestNotification
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Specify your upload directory

// Route to add attendance
router.post('/add', AttendanceController.addAttendance);

router.post('/api/upload/photo', upload.single('photo'), (req, res) => {
    // Handle the uploaded file
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Proceed with your logic (e.g., save file path to database)                                                                                                                                                
    res.send({ message: 'File uploaded successfully.' });
});

// Route to get attendance by employeeId
router.get('/:employeeId', AttendanceController.getAttendanceByEmployeeId);

// Route to update attendance by employeeId and time
router.put('/:employeeId/update', AttendanceController.updateAttendance);

// Route to delete attendance by employeeId and time
router.delete('/:employeeId/delete', AttendanceController.deleteAttendance);

module.exports = router;
