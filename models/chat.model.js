const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model
  attachment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  send_to: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, // Reference to User model
  send_by: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
