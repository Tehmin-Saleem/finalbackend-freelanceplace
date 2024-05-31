const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  country_name: {
    type: [String],
  }, // Country name
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email (required and unique)
  first_name: {
    type: String,
  }, // First name
  last_name: {
    type: String,
  }, // Last name
  password: {
    type: String,
    required: true,
  }, // Password (required)
  role: {
    type: String,
    enum: ["Freelancer", "Client"], // Enum for role values
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
