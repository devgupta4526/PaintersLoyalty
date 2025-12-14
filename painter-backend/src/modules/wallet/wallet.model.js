const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },

  totalEarned: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
  totalOfferRedeemed: { type: Number, default: 0 },

  balance: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
