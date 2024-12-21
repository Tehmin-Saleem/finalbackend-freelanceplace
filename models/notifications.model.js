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
  admin_email: {  
    type: String,
    required: function() { return this.type === 'new_query'; }  // Only required for new_query type
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
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() { return this.type !== 'new_query'; }  // Required for non-query notifications
  },
  type: {
    type: String,
   
    enum: ['hired', 'new_proposal', 'new_offer', 'milestone_completed', 'payment_received',  'new_query']
  }
});

const Notifications = mongoose.model("Notifications", notificationsSchema);

module.exports = Notifications;