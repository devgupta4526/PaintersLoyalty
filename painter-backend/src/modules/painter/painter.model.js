const mongoose = require('mongoose');

const PainterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

  fullName: String,
  mobile: String,
  address: String,
  city: String,
  pin: String,
  region: String, // Added for region-based features

  experienceYears: Number,
  skills: [String],

  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dealerApproved: { type: Boolean, default: false }, // Dealer approval status

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

  isProfileComplete: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false }, // Added for admin blocking
  isKycApproved: { type: Boolean, default: false }, // Added for KYC approval
  kycStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' } // KYC status tracking

}, { timestamps: true });

module.exports = mongoose.model('PainterProfile', PainterProfileSchema);
