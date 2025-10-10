
const Complaint = require('../models/Complaint');

// Create a new complaint
exports.createComplaint = async (req, res) => {
  console.log('POST /api/complaints route hit');
  console.log('Request body:', req.body);
  try {
    const { title, description, employeeId } = req.body;

    // Validate input
    if (!title || !description || !employeeId) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new complaint
    const newComplaint = new Complaint({ title, description, employeeId });
    const savedComplaint = await newComplaint.save();

    res.status(201).json(savedComplaint);
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get a complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Get complaints by employeeId
exports.getComplaintsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Fetch complaints by employeeId
    const complaints = await Complaint.find({ employeeId });
    
    if (complaints.length === 0) {
      return res.status(404).json({ message: 'No complaints found for this employee.' });
    }
    
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints by employeeId:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Update a complaint by ID
exports.updateComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Check if the complaint exists
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Update fields
    complaint.title = title || complaint.title;
    complaint.description = description || complaint.description;

    const updatedComplaint = await complaint.save();
    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};

// Delete a complaint by ID
exports.deleteComplaint = async (req, res) => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!deletedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
