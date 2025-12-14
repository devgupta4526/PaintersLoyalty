const mongoose = require('mongoose');

const OfferParticipationSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  progress: {
    currentLitres: { type: Number, default: 0 },
    requiredLitres: Number
  },

  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED', 'REDEEMED'],
    default: 'IN_PROGRESS'
  }
}, { timestamps: true });

module.exports = mongoose.model('OfferParticipation', OfferParticipationSchema);
