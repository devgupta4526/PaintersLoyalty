const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  type: {
    type: String,
    enum: [
      'COUPON_EARN',
      'WITHDRAWAL',
      'OFFER_REDEEM'
    ]
  },

  points: Number,

  referenceId: String, // couponId / withdrawalId / offerId

  month: Number,
  quarter: Number,
  year: Number

}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
