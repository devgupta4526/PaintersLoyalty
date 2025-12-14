const mongoose = require('mongoose');

const PainterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

  fullName: String,
  mobile: String,
  address: String,
  city: String,
  pin: String,

  experienceYears: Number,
  skills: [String],

  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  photoUrl: String,
  idProofUrl: String,

  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifsc: String,
    bankName: String
  },

  totalCouponsRedeemed: { type: Number, default: 0 },
  totalPointsEarned: { type: Number, default: 0 },

  isProfileComplete: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('PainterProfile', PainterProfileSchema);
