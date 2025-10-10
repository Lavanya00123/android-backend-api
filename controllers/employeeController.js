// controllers/employeeController.js
const Employee = require('../models/employee');

// Post Daily Call Logs for an employee
exports.postDailyCallLogs = async (req, res) => {
    try {
        const { employeeId, callLogs } = req.body;

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.callLogs.push(...callLogs); // Append new daily logs
        await employee.save();

        res.status(201).json({ message: 'Daily call logs added successfully' });
    } catch (error) {
        console.error('Error posting daily call logs:', error);
        res.status(500).json({ message: 'Server error posting daily call logs' });
    }
};

// Post Live Call Logs for an employee
exports.postLiveCallLogs = async (req, res) => {
    try {
        const { employeeId, callLogs } = req.body;

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.callLogs.push(...callLogs); // Append new live logs
        await employee.save();

        res.status(201).json({ message: 'Live call logs added successfully' });
    } catch (error) {
        console.error('Error posting live call logs:', error);
        res.status(500).json({ message: 'Server error posting live call logs' });
    }
};

// Fetch Daily Call Logs for an employee (Logs from today)
exports.fetchDailyCallLogs = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const today = new Date().setHours(0, 0, 0, 0);
        const now = new Date();

        const dailyLogs = employee.callLogs.filter(log => {
            const callDate = new Date(log.dateTime);
            return callDate >= today && callDate <= now;
        });

        res.status(200).json(dailyLogs);
    } catch (error) {
        console.error('Error fetching daily call logs:', error);
        res.status(500).json({ message: 'Server error fetching daily call logs' });
    }
};

// Fetch Live Call Logs for an employee (Logs from current session)
exports.fetchLiveCallLogs = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await Employee.findOne({ employeeId });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const now = new Date();
        const liveLogs = employee.callLogs.filter(log => {
            const callDate = new Date(log.dateTime);
            return callDate.getDate() === now.getDate() &&
                   callDate.getMonth() === now.getMonth() &&
                   callDate.getFullYear() === now.getFullYear();
        });

        res.status(200).json(liveLogs);
    } catch (error) {
        console.error('Error fetching live call logs:', error);
        res.status(500).json({ message: 'Server error fetching live call logs' });
    }
};

// Post Message for an employee
// exports.postMessage = async (req, res) => {
//     try {
//         const { employeeId, messages } = req.body;

//         const employee = await Employee.findOne({ employeeId });
//         if (!employee) {
//             return res.status(404).json({ message: 'Employee not found' });
//         }

//         employee.messages.push(...messages); // Append new messages
//         await employee.save();

//         res.status(201).json({ message: 'Messages added successfully' });
//     } catch (error) {
//         console.error('Error posting messages:', error);
//         res.status(500).json({ message: 'Server error posting messages' });
//     }
// };
