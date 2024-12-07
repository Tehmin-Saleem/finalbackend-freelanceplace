const mongoose = require('mongoose');

const ConsultantOfferSchema = new mongoose.Schema({
  consultant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConsultantProfile',
    required: true
  },
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  offerDetails: {
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fullName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }],
      averageRating: {
        type: Number,
        default: 0
      },
      totalReviews: {
        type: Number,
        default: 0
      }
    }
  },
  project_name: {
    type: String,
    required: true
  },
  offerDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add a virtual to populate project details
ConsultantOfferSchema.virtual('projectDetails', {
  ref: 'Project',
  localField: 'project_id',
  foreignField: '_id',
  justOne: true
});

// Enable virtual population
ConsultantOfferSchema.set('toObject', { virtuals: true });
ConsultantOfferSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ConsultantOffer', ConsultantOfferSchema);