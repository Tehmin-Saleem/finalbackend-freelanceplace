const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review_RequestSchema = new Schema({
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
  status: {
    type: String,
    enum: ["Active", "Pending", "Completed"], // Enum for status values
  },
});

const Review_Request = mongoose.model("Review_Request", Review_RequestSchema);

module.exports = Review_Request;
