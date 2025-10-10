// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser,getAllUsers,getUserById,updateUser,deleteUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/users', getAllUsers);         // Get all users
router.get('/users/:employeeId', getUserById);      // Get user by ID
router.put('/users/:id', updateUser);       // Update user by ID
router.delete('/users/:id', deleteUser);    // Delete user by ID

module.exports = router;


