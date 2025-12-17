const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: String,
  description: String,
  banner: String,

  startDate: Date,
  endDate: Date,

  eligibility: {
    minLitres: Number,
    productCategory: String
  },

  reward: {
    type: { type: String, enum: ['POINTS', 'GIFT'] },
    value: String
  },

  status: {
    type: String,
    enum: ['DRAFT', 'PENDING_DEALER', 'ACTIVE', 'CLOSED'],
    default: 'DRAFT'
  },

  dealerApproved: { type: Boolean, default: false }, // Added for dealer approval

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', OfferSchema);
