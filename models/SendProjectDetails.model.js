const mongoose = require('mongoose');

const ProjectDetailsSchema = new mongoose.Schema({
  offerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ConsultantOffer',
    required: true
  },
  consultantId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Consultant',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Client',
    required: true
  },
  githubUrl: {
    type: String,
    required: true
  },
  additionalNotes: {
    type: String
  },
  deadline: {
    type: Date,
    required: true
  },
  confidentialityAgreement: {
    type: Boolean,
    default: false
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProjectDetails', ProjectDetailsSchema);