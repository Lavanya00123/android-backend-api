const express = require('express')
const router = express.Router()
const AdminController = require('../controllers/AdminController')

router.post('/register', AdminController.registerUser)
router.post('/login', AdminController.adminLogin)

router.get('/list', AdminController.getAllAdmin)
router.get('/user/list', AdminController.getAllUsers)
router.get('/single/user/:employeeId', AdminController.getSingleUser)
router.get('/single/user/total-calls/:employeeId', AdminController.getSingleUserCalls)
router.get('/single/user/total-messages/:employeeId', AdminController.getSingleUserMessages)
router.get('/employees/:employeeId/call-logs', AdminController.getSingleUserCallLogs)
router.get('/employees/:employeeId/messages', AdminController.getSingleUserMessageLogs)

router.get('/users/list', AdminController.getAllUsersTwo)
router.post('/employees/:employeeId/status', AdminController.updateUserStatus)
router.get('/employees/:employeeId/attendance-list', AdminController.userAttendanceDetail)
router.get('/employees/:employeeId/attendance-list/complaints', AdminController.userComplaintDetail)






module.exports = router

