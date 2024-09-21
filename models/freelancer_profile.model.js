const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const portfolioSchema = new Schema({
  project_title: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  tool_used: {
    type: String,
  },
  url: { 
    type: String 
  },
  attachment: {
    type: String,
  },
});

const freelancer_ProfileSchema = new Schema({
  freelancer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
   
  },
  profileId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
  },
  profile_overview: {
    type: String,
  },
  experience: {
    completed_projects: {
      type: Number,
    },
  },
  availability: {
    full_time: {
      type: Boolean,
      default: false,
    },
    part_time: {
      type: Boolean,
      default: false,
    },
    hourly_rate: {
      type: Number,
    },
  },
  languages: [
    {
      language: {
        type: String,
      },
      proficiency_level: {
        type: String,
      },
    },
  ],
  skills: {
    type: [String],
  },
  portfolios: [portfolioSchema],
}, {
  timestamps: true
});

const Freelancer_Profile = mongoose.model(
  "Freelancer_Profile",
  freelancer_ProfileSchema
);

module.exports = Freelancer_Profile;