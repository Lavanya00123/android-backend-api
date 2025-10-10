// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

// Post Daily Call Logs
router.post('/employees/:employeeId/callLogs/daily', employeeController.postDailyCallLogs);

// Post Live Call Logs
router.post('/employees/:employeeId/callLogs/live', employeeController.postLiveCallLogs);

// Fetch Daily Call Logs
router.get('/employees/:employeeId/callLogs/daily', employeeController.fetchDailyCallLogs);

// Fetch Live Call Logs
router.get('/employees/:employeeId/callLogs/live', employeeController.fetchLiveCallLogs);

// Post Messages
// router.post('/employees/:employeeId/messages', employeeController.postMessage);

module.exports = router;
