const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  value: { type: Number, required: true }, // Points value
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Dealer or painter
  redeemedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Painter who redeemed
  status: { type: String, enum: ['UNUSED', 'REDEEMED', 'EXPIRED'], default: 'UNUSED' },
  expiresAt: Date,
  redeemedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);

