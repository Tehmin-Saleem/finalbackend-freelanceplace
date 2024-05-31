const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const freelancer_ProfileSchema = new Schema({
  availability: {
    full_time: {
      type: Boolean,
    },
    hourly_rate: {
      type: Number,
    },
    part_time: {
      type: Boolean,
      default: false,
    },
  },
  experience: {
    completed_projects: {
      type: Number,
    },
  },
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  first_name: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  image: {
    type: String,
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
  last_name: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  profile_overview: {
    type: String,
  },
  portfolio: {
    attachment: {
      type: String,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    project_title: {
      type: String,
    },
    tool_used: {
      type: String,
    },
    url: { type: String },
  },
  skills: {
    type: [String],
  },
  title: {
    type: String,
  },
});

const Freelancer_Profile = mongoose.model(
  "Freelancer_Profile",
  freelancer_ProfileSchema
);

module.exports = Freelancer_Profile;
