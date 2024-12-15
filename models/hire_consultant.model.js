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
    required: function() { return this.budget_type === 'fixed'; }
  },
  client_review_stats: {
    average_rating: Number,
    total_reviews: Number
  },
  offer_details: {
    client: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fullName: {
        type: String,
      },
      email: {
        type: String,
      },
      reviewStats: {
        averageRating: Number,
        totalReviews: Number
      }
    },
    project: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
      },
      name: String,
      description: String
    },
    consultant: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ConsultantProfile'
      },
      name: String,
      email: String,
      experience: [Object],
      linkedIn: String,
      education: [Object],
      bio: String,
      skills: [String]
    },
    budget: {
      type: {
        type: String,
        enum: ['hourly', 'fixed'],
        required: true
      },
      hourlyRateFrom: Number,
      hourlyRateTo: Number,
      fixedPrice: Number
    }
  },
  project_name: {
    type: String,
    required: true
  },
  project_description: {
    type: String,
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
