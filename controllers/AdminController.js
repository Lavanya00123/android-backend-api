const Admin = require("../models/Admin");
const User = require("../models/userModel");
const Attendance = require("../models/Attendance");
const Employee = require("../models/employee");
const Complaint = require("../models/Complaint");



exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Received data:", { username, password });

    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already registered. Please login." });
    }

    const newUser = new Admin({ username, password });
    const result = await newUser.save();
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username }).select("+password");
    // console.log(admin)
    if (admin) {
      console.log(admin);
      return res.status(201).json(admin);
    } else {
    }
  } catch (error) {
    return res.status(500).json({ error: "Error login user" });
  }
};

exports.getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Employee.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await User.findOne({ employeeId }); // Adjust if `employeeId` is stored differently

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// Fetch employee's total call logs count by employeeId
exports.getSingleUserCalls = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee using employeeId from the request params
    const employee = await Employee.findOne({ employeeId });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Get the total number of calls
    const totalCalls = employee.callLogs ? employee.callLogs.length : 0;

    // Return the total number of calls
    res.status(200).json({
      employeeId: employee.employeeId,
      name: employee.name,
      totalCalls: totalCalls,
    });
  } catch (error) {
    console.error("Error fetching total call logs:", error);
    res.status(500).json({ error: "Error fetching total call logs" });
  }
};


// Example Express route for getting total messages
exports.getSingleUserMessages = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Fetch the employee using employeeId from the request params
    const employee = await Employee.findOne({ employeeId });

    // If employee not found, return 404
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Get the total number of calls
    const totalMessages = employee.messages ? employee.messages.length : 0;

    // Return the total number of calls
    res.status(200).json({
      employeeId: employee.employeeId,
      name: employee.name,
      totalMessages: totalMessages,
    });
  } catch (error) {
    console.error("Error fetching total call logs:", error);
    res.status(500).json({ error: "Error fetching total call logs" });
  }
}



exports.getSingleUserCallLogs = async (req, res) => {
  const { employeeId } = req.params;
  const { search = "", type = "All" } = req.query; // Default to empty string for search

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    let filteredLogs = employee.callLogs || [];

    // Filter by search query
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          (log.name && log.name.toLowerCase().includes(searchLower)) ||
          (log.phoneNumber && log.phoneNumber.includes(search))(
            log.employeeId && log.employeeId.includes(search)
          )
      );
    }

    // Filter by type
    if (type !== "All") {
      filteredLogs = filteredLogs.filter((log) => log.type === type);
    }

    res.status(200).json(filteredLogs);
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ error: "Error fetching call logs" });
  }
}


exports.getSingleUserMessageLogs = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee.messages); // Ensure response is JSON
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ error: "Error fetching call logs" });
  }
}




exports.getAllUsersTwo = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





exports.updateUserStatus = async (req, res) => {
  const { employeeId } = req.params;
  const { status } = req.body; // Expecting status to be 'Approved', 'Rejected', or 'Pending'

  try {
    // Validate status
    if (
      status !== "Approved" &&
      status !== "Rejected" &&
      status !== "Pending"
    ) {
      return res.status(400).json({
        message:
          'Invalid status value. Must be "Approved", "Rejected", or "Pending".',
      });
    }

    // Update employee's ApproveStatus
    const updatedEmployee = await User.findOneAndUpdate(
      { employeeId },
      { ApproveStatus: status },
      { new: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee status:", error);
    res.status(500).json({ message: "Server error" });
  }
}





exports.userAttendanceDetail  = async (req, res) => {
  try {
    // Fetch employee details
    const employee = await User.findOne({
      employeeId: req.params.employeeId,
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Prepare attendance query
    const { date } = req.query; 
    let attendanceQuery = { employeeId: req.params.employeeId };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1); // End of the selected date

      attendanceQuery["location.time"] = { $gte: startDate, $lt: endDate };
    }

    // Fetch attendance records
    const attendance = await Attendance.find(attendanceQuery);

    if (!attendance.length) {
      return res
        .status(404)
        .json({ error: "No attendance records found for the employee" });
    }

    console.log("Employee Data: ", employee);
    console.log("Filtered Attendance Records: ", attendance); // Debugging line

    // Send response
    res.status(200).json({
      employeeId: employee.employeeId,
      userName: employee.userName,
      name: employee.name,
      mobileNumber: employee.mobileNumber,
      branch: employee.branch,
      designation: employee.designation,
      attendance, // Includes `photoUri` if present in the schema
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).json({ error: "Error fetching employee data" });
  }
}


exports.userComplaintDetail = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const complaints = await Complaint.find({ employeeId });
      res.status(200).json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ error: "Error fetching complaints" });
    }
  }
