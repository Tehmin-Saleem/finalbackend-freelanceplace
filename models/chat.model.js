const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  client_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  }, 
  
  freelancer_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },

  attachment: {
    type: String,
    validate: {
      validator: function(v) {
        // Ensure the string contains a valid file URL or path
        return v == null || v.match(/\.(jpg|jpeg|png|pdf|doc|docx|mp4|zip|rar|txt)$/i);
      },
      message: "Invalid file type",
    },
  },

  messages: [
    {
      sender: {
        type: String,
        required: true,
        enum: ["client", "freelancer"], // Only allow these two values for sender
      },
      message: { 
        type: String, 
        required: true 
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      },
    },
  ],
},
{ timestamps: true }
);


const Chatprevious = mongoose.model("Chatprevious", chatSchema);

module.exports = Chatprevious;



