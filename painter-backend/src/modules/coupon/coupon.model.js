const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  points: { type: Number, required: true },

  dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  isRedeemed: { type: Boolean, default: false },
  redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  redeemedAt: Date

}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);

