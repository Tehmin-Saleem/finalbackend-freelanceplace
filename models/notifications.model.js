const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, 
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, 
  
  is_read: {
    type: Boolean,
    default: false,
  }, 
  job_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Job_Post",
  }, 
  timestamp: {
    type: Date,
    default: Date.now,
  }, 
  message: {
    type: String,
    required: true,
  },
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;
