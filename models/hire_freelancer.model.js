const mongoose = require("mongoose");
const hireFreelancer = mongoose.Schema({
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    // required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    // required: true,
  },
 
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostJob", 
    // required: true,
  },
});
module.exports = mongoose.model("HireFreelancer", hireFreelancer);
