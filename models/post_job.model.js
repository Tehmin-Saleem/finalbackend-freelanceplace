const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const job_PostSchema = new Schema({
  attachment: {
    detailed_description: {
      type: String,
    },
    file: {
      type: String,
      maxlength: 100, // Maximum file size in MB (assuming the file is stored as a URL or path)
    },
  },
  budget_type: {
    type: String,
    enum: ["Hourly_rate", "Fixed_price"], // Enum for budget type values
    required: true,
  },
  hourly_rate: {
    budget_range: {
      from: {
        type: Number,
      },
      to: {
        type: Number,
      },
    },
  },
  fixed_price: {
    type: Number,
  }, // Fixed price for the project
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Default value for created_at is current timestamp
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model (client)
  description: {
    type: String,
  }, // Job description
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model (freelancer)
  job_title: {
    type: String,
    required: true,
  }, // Title of the job
  project_duration: {
    project_size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
    }, // Enum for project size
    duration_of_work: {
      type: String,
      enum: ["Less than one month", "1 to 3 months", "3 to 6 months"],
    }, // Enum for duration of work
    experience_level: {
      type: String,
      enum: ["Entry", "Intermediate", "Expert"],
    }, // Enum for experience level
  },
  preferred_skills: {
    type: [String],
  }, // Array of preferred skills
  status: {
    type: String,
    enum: ["Public", "Private"], // Enum for status values
  },
});

const Job_Post = mongoose.model("Job_Post", job_PostSchema);

module.exports = Job_Post;
