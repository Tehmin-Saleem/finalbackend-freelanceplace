const mongoose = require("mongoose");
const HireFreelancer = new mongoose.Schema({
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job_Post',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'completed', 'cancelled'],
    default: 'pending'
  },
  hiredAt: {
    type: Date,
    default: Date.now
  },
  terms: {
    rate: Number,
    projectDuration: String,
    startDate: Date
  }
}, {
  timestamps: true
});
module.exports = mongoose.model("HireFreelancer", HireFreelancer);
