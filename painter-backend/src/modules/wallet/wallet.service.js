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

exports.getYearlyEarnings = async (userId) => {
  return Transaction.aggregate([
    { $match: { userId, type: 'COUPON_EARN' } },
    {
      $group: {
        _id: '$year',
        totalPoints: { $sum: '$points' }
      }
    }
  ]);
};

exports.getTransactions = async (userId, filters) => {
  const match = { userId };
  if (filters.type) match.type = filters.type;
  if (filters.month) match.month = Number(filters.month);
  if (filters.quarter) match.quarter = Number(filters.quarter);
  if (filters.year) match.year = Number(filters.year);
  return Transaction.find(match).sort({ createdAt: -1 });
};

exports.getWithdrawalEligibility = async (userId) => {
  const now = new Date();
  const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);
  const currentYear = now.getFullYear();
  // Logic for eligibility windows
  return {
    quarterlyEligible: true, // Implement based on dates
    yearlyEligible: true,
    nextQuarterlyDate: '2025-04-01',
    nextYearlyDate: '2026-01-01'
  };
};
