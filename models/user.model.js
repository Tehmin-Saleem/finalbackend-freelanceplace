const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const userSchema = new Schema({
  country_name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["freelancer", "client", "consultant"], // Added consultant
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  softBanned: {
    type: Boolean,
    default: false,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  freelancer_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Self-referencing
  },
  client_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Self-referencing
  },
  consultant_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Self-referencing
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
