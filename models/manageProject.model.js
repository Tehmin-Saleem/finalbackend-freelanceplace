// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ProjectSchema = new Schema({
//   projectName: {
//     type: String,
//     required: true
//   },
//   progress: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 100
//   },
//   due_date: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Ongoing', 'Pending Approval', 'Completed'],
//     default: 'Ongoing'
//   },
//   clientApproved: {
//     type: Boolean,
//     default: false
//   },
//   description: {
//     type: String
//   },
//   budget: {
//     type: Number,
//     required: true
//   },
//   projectType: {
//     type: String,
//     enum: ['milestone', 'project'],
//     required: true
//   },
//   milestones: [{
//     name: {
//       type: String,
//       required: true
//     },
//     status: {
//       type: String,
//       enum: ['Not Started', 'In Progress', 'Completed'],
//       default: 'Not Started'
//     },
//     amount: {
//       type: Number
//     },
//     due_date: {
//       type: Date
//     }
//   }],
//   proposal_id: {
//     type: mongoose.Types.ObjectId,
//     ref: 'Proposal',
//     required: true
//   },
//   client_id: {
//     type: mongoose.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   freelancer_id: {
//     type: mongoose.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// }, {
//   timestamps: true
// });

// // Pre-save middleware to check status based on progress and due date
// ProjectSchema.pre('save', function(next) {
//   if (this.isModified('progress') || this.isModified('due_date')) {
//     const currentDate = new Date();
//     const dueDate = new Date(this.due_date);

//     if (this.progress === 100) {
//       this.status = 'Pending Approval';
//     } else if (currentDate <= dueDate) {
//       this.status = 'Ongoing';
//     }
//   }
//   next();
// });

// const Project = mongoose.model("Project", ProjectSchema);

// module.exports = Project;
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
    ref: 'Client'
  },
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);