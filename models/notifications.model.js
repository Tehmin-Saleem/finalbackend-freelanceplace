const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model
  is_read: {
    type: Boolean,
    default: false,
  }, // Default value for is_read is false
  job_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Job_Post",
  }, // Reference to Job model
  timestamp: {
    type: Date,
    default: Date.now,
  }, // Default value for timestamp is current timestamp
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
