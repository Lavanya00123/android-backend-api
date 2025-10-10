const Salary = require('../models/SalaryModel');

// Create or update salary for an employee
exports.createOrUpdateSalary = async (req, res) => {
  const { employeeId, basicSalary, noOfLeaves, advanceSalary = 0 } = req.body;

  try {
    const perDaySalary = basicSalary / 30;
    const deductedSalary = (perDaySalary * noOfLeaves) + advanceSalary;
    const actualSalary = basicSalary - deductedSalary;

    const salaryData = await Salary.findOneAndUpdate(
      { employeeId },
      { employeeId, basicSalary, perDaySalary, noOfLeaves, advanceSalary, deductedSalary, actualSalary },
      { new: true, upsert: true }
    );

    res.status(200).json(salaryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get salary details by employeeId
exports.getSalaryById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const salaryData = await Salary.findOne({ employeeId });
    if (!salaryData) return res.status(404).json({ message: 'Salary data not found' });
    res.status(200).json(salaryData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update salary data for an employee
exports.updateSalary = async (req, res) => {
  const { employeeId } = req.params;
  const { basicSalary, noOfLeaves, advanceSalary = 0 } = req.body;

  try {
    const perDaySalary = basicSalary / 30;
    const deductedSalary = (perDaySalary * noOfLeaves) + advanceSalary;
    const actualSalary = basicSalary - deductedSalary;

    const updatedSalary = await Salary.findOneAndUpdate(
      { employeeId },
      { basicSalary, noOfLeaves, perDaySalary, advanceSalary, deductedSalary, actualSalary },
      { new: true }
    );

    if (!updatedSalary) return res.status(404).json({ message: 'Salary data not found' });
    res.status(200).json(updatedSalary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete salary data by employeeId
exports.deleteSalary = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const deletedSalary = await Salary.findOneAndDelete({ employeeId });
    if (!deletedSalary) return res.status(404).json({ message: 'Salary data not found' });
    res.status(200).json({ message: 'Salary data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all salary records
exports.getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({});
    res.status(200).json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
