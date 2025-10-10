const express = require('express');
const router = express.Router();
const {
  createOrUpdateSalary,
  getSalaryById,
  updateSalary,
  deleteSalary,
  getAllSalaries,
} = require('../controllers/SalaryControllers');

// Route to create or update salary
router.post('/salary', createOrUpdateSalary);

// Route to get salary by employeeId
router.get('/salary/:employeeId', getSalaryById);

// Route to update salary by employeeId
router.put('/salary/:employeeId', updateSalary);

// Route to delete salary by employeeId
router.delete('/salary/:employeeId', deleteSalary);

// Route to get all salary records
router.get('/salaries', getAllSalaries);

module.exports = router;
