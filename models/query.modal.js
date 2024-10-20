// models/query.model.js
const mongoose = require('mongoose');


const querySchema = new mongoose.Schema({
    queryType: {
      type: String,
      required: true,
      enum: ['Freelancer', 'Client'],
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // Assuming userId is an ObjectId
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Query = mongoose.model('Query', querySchema);
  module.exports = Query;
  