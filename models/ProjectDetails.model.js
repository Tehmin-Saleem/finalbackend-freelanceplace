const mongoose = require('mongoose');

const ConsultantOfferSchema = new mongoose.Schema({
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Consultant' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  status: { type: String, default: 'Pending' },
  projectDetails: {
    projectTitle: String,
    projectDescription: String,
    deadline: Date,
    githubUrl: String,
    additionalNotes: String,
  },
});

module.exports = mongoose.model('ConsultantOffer', ConsultantOfferSchema);
