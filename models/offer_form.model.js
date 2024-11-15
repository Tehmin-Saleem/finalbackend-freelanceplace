const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Offer_FormSchema = new Schema({
  attachment: {
    fileName: String,
    path: String,
    description: String
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  budget_type: { 
    type: String, 
    enum: ['hourly', 'fixed'], 
    required: true 
  },
  hourly_rate: {
    from: { 
      type: Number, 
      required: function() { return this.budget_type === 'hourly'; } 
    },
    to: { 
      type: Number, 
      required: function() { return this.budget_type === 'hourly'; } 
    }

  },
  fixed_price: {
    type: Number,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
  client_id: {
    type: mongoose.Types.ObjectId,
    
    ref: "User",
  }, 
  description: {
    type: String,
  }, 
  detailed_description: {
    type: String,
  }, 
  freelancer_id: {
    type: mongoose.Types.ObjectId,
   
    ref: "User",
  }, 
  job_title: {
    type: String,
   
  }, 
  due_date: {
    type: Date,
    required: true
  },
  
  estimated_timeline: {
    duration: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['hours', 'days', 'weeks', 'months']
    }
  },
  preferred_skills: {
    type: [String],
  }, 
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId()
  },
});

const Offer_Form = mongoose.model("Offer_Form", Offer_FormSchema);

module.exports = Offer_Form;
