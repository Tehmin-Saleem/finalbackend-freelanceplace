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
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  cover_letter: {
    type: String,
  },
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  job_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Job_Post",
  },
  project_duration: {
    type: String,
  },
  portfolio_link: {
    type: String,
  },
});

const Proposal = mongoose.model("Proposal", ProposalSchema);

module.exports = Proposal;
