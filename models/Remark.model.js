const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Client',
    },
    consultantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Consultant',
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Offer',
    },
    remark: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Remark', remarkSchema);
