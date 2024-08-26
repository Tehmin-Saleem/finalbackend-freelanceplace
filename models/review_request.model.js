const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review_RequestSchema = new Schema({
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
  status: {
    type: String,
    enum: ["Active", "Pending", "Completed"], 
  },
});

const Review_Request = mongoose.model("Review_Request", Review_RequestSchema);

module.exports = Review_Request;
