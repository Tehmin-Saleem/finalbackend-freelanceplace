const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const job_PostSchema = new Schema({
  attachment: {
    fileName: String,
    path: String,
    description: String
  },
  budget_type: { type: String, enum: ['hourly', 'fixed'], required: true },
  hourly_rate: {
    from: { type: Number },
    to: { type: Number }
  },
  fixed_price: {
    type: Number,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
  client_id: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "User",
  }, 
  description: {
    type: String,
  }, 
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "User",
  }, 
  job_title: {
    type: String,
    required: true,
  }, 
  project_duration: {
    project_size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
    }, 
    duration_of_work: {
      type: String,
      enum: ["Less than 1 month", "1 to 3 months", "3 to 6 months"],
    }, 
    experience_level: {
      type: String,
      enum: ["Entry", "Intermediate", "Expert"],
    }, 
  },
  preferred_skills: {
    type: [String],
  }, 
  status: {
    type: String,
    enum: ["public", "private"], 
  },
});

const Job_Post = mongoose.model("Job_Post", job_PostSchema);

module.exports = Job_Post;
