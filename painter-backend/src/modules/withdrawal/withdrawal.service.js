const Withdrawal = require('./withdrawal.model');
const Wallet = require('../wallet/wallet.model');
const Transaction = require('../wallet/transaction.model');
const PainterProfile = require('../painter/painter.model');

const isValidWithdrawalPeriod = (type) => {
  const month = new Date().getMonth() + 1;

  if (type === 'QUARTERLY') {
    return [3, 6, 9, 12].includes(month);
  }

  if (type === 'YEARLY') {
    return month === 12;
  }

  return false;
};

exports.requestWithdrawal = async (userId, type, points) => {
  if (!isValidWithdrawalPeriod(type)) {
    throw new Error('Withdrawal not allowed in this period');
  }

  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.balance < points) {
    throw new Error('Insufficient balance');
  }

  const profile = await PainterProfile.findOne({ userId });
  if (!profile?.bankDetails?.accountNumber) {
    throw new Error('Bank details not updated');
  }

  // Lock balance (soft lock until approval)
  wallet.balance -= points;
  wallet.totalWithdrawn += points;
  await wallet.save();

  const withdrawal = await Withdrawal.create({
    userId,
    type,
    points,
    bankDetails: profile.bankDetails
  });

  const now = new Date();
  await Transaction.create({
    userId,
    type: 'WITHDRAWAL',
    points,
    referenceId: withdrawal._id,
    month: now.getMonth() + 1,
    quarter: Math.ceil((now.getMonth() + 1) / 3),
    year: now.getFullYear()
  });

  return withdrawal;
};

exports.getUserWithdrawals = async (userId) => {
  return Withdrawal.find({ userId }).sort({ createdAt: -1 });
};
