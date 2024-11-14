
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Milestone name is required']
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started'
  },
  amount: {
    type: Number,
    required: [true, 'Milestone amount is required'],
    min: 0
  },
  due_date: {
    type: Date,
    required: [true, 'Milestone due date is required']
  }
});

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required']
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  due_date: {
    type: Date,
    required: [true, 'Due date is required']
  },
  milestones: [milestoneSchema],
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: 0
  },
  description: {
    type: String,
    default: ''
  },
  projectType: {
    type: String,
    enum: ['milestone', 'fixed'],
    default: 'milestone'
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Pending Approval', 'Completed'],
    default: 'Ongoing'
  },
  clientApproved: {
    type: Boolean,
    default: false
  },
  proposal_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  freelancer_profile_id: {  // Changed from freelancer_id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer_Profile',  // Direct reference to Freelancer_Profile
    
}
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);





// ======
