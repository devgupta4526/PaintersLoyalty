const mongoose = require('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  type: {
    type: String,
    enum: ['QUARTERLY', 'YEARLY'],
    required: true
  },

  points: { type: Number, required: true },

  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifsc: String,
    bankName: String
  },

  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
    default: 'PENDING'
  },

  adminRemark: String

}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
