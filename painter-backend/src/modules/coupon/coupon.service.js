const Coupon = require('./coupon.model');
const Wallet = require('../wallet/wallet.model');
const Transaction = require('../wallet/transaction.model');
const PainterProfile = require('../painter/painter.model');

exports.redeemCoupon = async (userId, code) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new Error('Invalid coupon code');

  if (coupon.isRedeemed) {
    throw new Error('Coupon already redeemed');
  }

  // Lock coupon
  coupon.isRedeemed = true;
  coupon.redeemedBy = userId;
  coupon.redeemedAt = new Date();
  await coupon.save();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const quarter = Math.ceil(month / 3);

  // Wallet
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) wallet = await Wallet.create({ userId });

  wallet.totalEarned += coupon.points;
  wallet.balance += coupon.points;
  await wallet.save();

  // Transaction
  await Transaction.create({
    userId,
    type: 'COUPON_EARN',
    points: coupon.points,
    referenceId: coupon._id,
    month,
    quarter,
    year
  });

  // Update painter profile stats
  await PainterProfile.findOneAndUpdate(
    { userId },
    {
      $inc: {
        totalCouponsRedeemed: 1,
        totalPointsEarned: coupon.points
      }
    }
  );

  return {
    pointsEarned: coupon.points,
    currentBalance: wallet.balance
  };
};
