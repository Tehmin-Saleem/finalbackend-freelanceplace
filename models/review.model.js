const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
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
  message: {
    type: String,
  }, 
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
  }, 
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
