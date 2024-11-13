const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProposalSchema = new Schema({
  add_requirements: {
    by_milestones: [
      {
        amount: {
          type: Number,
        },
        description: {
          type: String,
        },
        due_date: {
          type: Date,
        },
      },
    ],
    by_project: {
      bid_amount: {
        type: Number,
      },
      due_date: {
        type: Date,
      },
    },
  },
  attachment: {
    type: String,
  },
  Proposal_id:{
    type: mongoose.Types.ObjectId,

  },
  client_id: {
    type: mongoose.Types.ObjectId,
    
    ref: "User",
  },
  cover_letter: {
    type: String,
  },
 
  job_id: {
    type: mongoose.Types.ObjectId,
    
    ref: "Job_Post",
  },
  freelancer_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' ,  
  },
  
  project_duration: {
    type: String,
  },
  portfolio_link: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending'
  },
  hired_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This will add createdAt and updatedAt fields
});

const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
