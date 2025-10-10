// ComplaintsModel.js
const mongoose = require('mongoose');

// Define the schema for a complaint
const ComplaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the model
const Complaint = mongoose.model('Complaint', ComplaintSchema);

module.exports = Complaint;

