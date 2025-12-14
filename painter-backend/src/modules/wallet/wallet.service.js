const Wallet = require('./wallet.model');
const Transaction = require('./transaction.model');

exports.getWalletSummary = async (userId) => {
  return Wallet.findOne({ userId });
};

exports.getMonthlyEarnings = async (userId, year) => {
  return Transaction.aggregate([
    { $match: { userId, year, type: 'COUPON_EARN' } },
    {
      $group: {
        _id: '$month',
        totalPoints: { $sum: '$points' }
      }
    }
  ]);
};

exports.getQuarterlyEarnings = async (userId, year) => {
  return Transaction.aggregate([
    { $match: { userId, year, type: 'COUPON_EARN' } },
    {
      $group: {
        _id: '$quarter',
        totalPoints: { $sum: '$points' }
      }
    }
  ]);
};
