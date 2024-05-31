const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model (client)
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Default value for created_at is current timestamp
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model (freelancer)
  job_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Job_Post",
  }, // Reference to JobPost model (job)
  message: {
    type: String,
  }, // Review message
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["Pending", "Deleted", "Completed"],
  },
  updated_at: {
    type: Date,
  }, // Default value for updated_at is current timestamp
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
