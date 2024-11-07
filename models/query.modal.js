// models/query.model.js
const mongoose = require('mongoose');


const querySchema = new mongoose.Schema({
    queryType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Client'],
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming userId is an ObjectId
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'In Progress', 'Resolved'],  // Enum with different statuses
        default: 'Pending',  // Default to "Pending" when a query is first created
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Query = mongoose.model('Query', querySchema);
module.exports = Query;

  