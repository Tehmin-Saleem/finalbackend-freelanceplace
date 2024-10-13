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
    enum: ["freelancer", "client"],
  },


  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
 
},
{ timestaps: true }
);

// userSchema.methods.createPasswordResetToken = function () {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   // Hash the token before saving to the database
//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
//   // Set expiration (10 minutes from now)
//   this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//   return resetToken; // Return the plain token (not hashed) to send via email
// };
  // image: {
  //   type: "String",
  //   required: true,
  //   default:
  //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  // },

 


const User = mongoose.model("User", userSchema);

module.exports = User;
