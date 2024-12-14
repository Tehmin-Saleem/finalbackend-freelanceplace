const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }, 
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }, 
  consultant_id: {
    type: mongoose.Types.ObjectId,
    ref: "ConsultantProfile",
  }, 
  is_read: {
    type: Boolean,
    default: false,
  }, 
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  job_id: {
    type: mongoose.Types.ObjectId,
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
  type: {
    type: String,
    required: true,
    enum: ['hired', 'new_proposal', 'new_offer', 'milestone_completed', 'payment_received']
  }
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;