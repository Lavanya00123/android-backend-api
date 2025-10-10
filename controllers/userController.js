// controllers/userController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Employee = require('../models/employee'); // Import the Employee model
// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token valid for 1 day
  });
};


exports.registerUser = async (req, res) => {
  const { 
    employeeId, 
    userName,
    name, 
    mobileNumber, 
    alternateMobileNumber, 
    password, 
    confirmPassword, 
    branch, 
    designation, 
    dateOfBirth, 
    address, 
    joinDate, 
    fatherName, 
    spouseName, 
    gender,
    salary ,
  } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ employeeId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Ensure passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ 
      employeeId, 
      userName,
      name, 
      mobileNumber, 
      alternateMobileNumber, 
      password: hashedPassword, 
      confirmPassword:hashedPassword,
      branch, 
      designation, 
      dateOfBirth, 
      address, 
      joinDate, 
      fatherName, 
      spouseName, 
      gender,
      salary ,
      
    });

    

    // Save the new user
    await newUser.save();

    // Create a corresponding employee record (if necessary)
    const newEmployee = new Employee({
      employeeId,
      name,
      mobileNumber,
      callLogs: [],
      messages: [],
      location: {
        latitude: null,
        longitude: null,
        timestamp: null,
      }
    });

    // Save the employee record
    await newEmployee.save();

    // Generate and return token
    const token = generateToken(newUser._id);
    res.status(201).json({ message: 'User registered successfully', token });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};



// Register a new user
// exports.registerUser = async (req, res) => {
//   const { employeeId, name, mobileNumber, password } = req.body;
  
//   try {
//     const existingUser = await User.findOne({ employeeId });
//     if (existingUser) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ employeeId, name, mobileNumber, password: hashedPassword });
//     await newUser.save();

//     // Generate and return token
//     const token = generateToken(newUser._id);

//     res.status(201).json({ message: 'User registered successfully', token });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Login user
exports.loginUser = async (req, res) => {
  const { employeeId, password } = req.body;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the user is approved
    if (user.ApproveStatus !== 'Approved') {
      return res.status(403).json({ message: 'Account not approved. Please contact HR.' });
    }

    // Generate and return token
    const token = generateToken(user._id);

    // Send response with token and user details
    res.json({
      token,
      name: user.name,
      mobileNumber: user.mobileNumber,
      ApproveStatus: user.ApproveStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const user = await User.findOne({ employeeId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { userName, name, mobileNumber, alternateMobileNumber, branch, designation, dateOfBirth, address, joinDate, fatherName, spouseName, gender, salary } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { userName, name, mobileNumber, alternateMobileNumber, branch, designation, dateOfBirth, address, joinDate, fatherName, spouseName, gender, salary },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};