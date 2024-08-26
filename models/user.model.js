const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    enum: ["freelancer", "client"], 
   
  },
 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
