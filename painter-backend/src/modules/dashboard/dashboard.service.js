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
    status: 'ACTIVE'
  }).limit(3);

  const trainings = await Training.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(3);

  const latestNotifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5);

  const complaintSummary = await require('../complaint/complaint.model').aggregate([
    { $match: { userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const inProgressOffers = await Offer.countDocuments({
    participants: userId,
    status: 'ACTIVE'
  });

  const completedTrainings = await require('../training/training.progress.model').countDocuments({
    userId,
    completed: true
  });

  const withdrawalEligibility = {
    quarterlyEligible: true, // Logic based on dates
    yearlyEligible: true,
    nextQuarterlyDate: '2025-04-01',
    nextYearlyDate: '2026-01-01'
  };

  return {
    walletBalance: wallet?.balance || 0,
    monthlyEarnings: monthlyEarnings[0]?.total || 0,
    quarterlyEarnings: quarterlyEarnings[0]?.total || 0,
    yearlyEarnings: yearlyEarnings[0]?.total || 0,
    latestOffers: offers,
    newTrainings: trainings.filter(t => t.isNew),
    latestNotifications,
    complaintSummary: complaintSummary.reduce((acc, s) => {
      acc[s._id] = s.count;
      return acc;
    }, {}),
    offerProgressSummary: {
      inProgress: inProgressOffers,
      completed: await Offer.countDocuments({ participants: userId, status: 'COMPLETED' })
    },
    trainingHighlights: {
      completed: completedTrainings,
      inProgress: await require('../training/training.progress.model').countDocuments({
        userId,
        completed: false
      })
    },
    withdrawalEligibility
  };
};
