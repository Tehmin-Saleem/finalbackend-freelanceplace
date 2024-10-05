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
  // image: {
  //   type: "String",
  //   required: true,
  //   default:
  //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  // },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
},
{ timestaps: true }
 
);

const User = mongoose.model("User", userSchema);

module.exports = User;
