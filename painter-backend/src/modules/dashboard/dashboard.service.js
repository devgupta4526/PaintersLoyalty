const Wallet = require('../wallet/wallet.model');
const Transaction = require('../wallet/transaction.model');
const Offer = require('../offer/offer.model');
const Training = require('../training/training.model');
const Notification = require('../notification/notification.model');

const getCurrentQuarter = (month) => Math.ceil(month / 3);

exports.getPainterDashboard = async (userId) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const quarter = getCurrentQuarter(month);

  const wallet = await Wallet.findOne({ userId });

  const monthlyEarnings = await Transaction.aggregate([
    {
      $match: {
        userId,
        month,
        year,
        type: 'COUPON_EARN'
      }
    },
    { $group: { _id: null, total: { $sum: '$points' } } }
  ]);

  const quarterlyEarnings = await Transaction.aggregate([
    {
      $match: {
        userId,
        quarter,
        year,
        type: 'COUPON_EARN'
      }
    },
    { $group: { _id: null, total: { $sum: '$points' } } }
  ]);

  const yearlyEarnings = await Transaction.aggregate([
    {
      $match: {
        userId,
        year,
        type: 'COUPON_EARN'
      }
    },
    { $group: { _id: null, total: { $sum: '$points' } } }
  ]);

  const offers = await Offer.find({
    status: 'ONGOING'
  }).limit(3);

  const trainings = await Training.find()
    .sort({ createdAt: -1 })
    .limit(3);

  const unreadNotifications = await Notification.countDocuments({
    userId,
    isRead: false
  });

  return {
    walletBalance: wallet?.balance || 0,
    monthlyEarnings: monthlyEarnings[0]?.total || 0,
    quarterlyEarnings: quarterlyEarnings[0]?.total || 0,
    yearlyEarnings: yearlyEarnings[0]?.total || 0,
    latestOffers: offers,
    newTrainings: trainings,
    unreadNotifications
  };
};
