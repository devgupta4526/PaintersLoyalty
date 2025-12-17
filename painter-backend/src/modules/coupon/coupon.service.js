const Coupon = require('./coupon.model');
const Wallet = require('../wallet/wallet.model');
const Transaction = require('../wallet/transaction.model');
const PainterProfile = require('../painter/painter.model');

exports.validateCoupon = async (code) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new Error('Invalid coupon code');
  if (coupon.status !== 'UNUSED') throw new Error('Coupon not available');
  if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new Error('Coupon expired');
  return { valid: true, value: coupon.value };
};

exports.redeemCoupon = async (userId, code) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new Error('Invalid coupon code');

  if (coupon.status !== 'UNUSED') {
    throw new Error('Coupon already redeemed or expired');
  }

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    coupon.status = 'EXPIRED';
    await coupon.save();
    throw new Error('Coupon expired');
  }

  // Redeem coupon
  coupon.status = 'REDEEMED';
  coupon.redeemedBy = userId;
  coupon.redeemedAt = new Date();
  await coupon.save();

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
    pointsEarned: coupon.value,
    currentBalance: wallet.balance
  };
};

exports.getMyCoupons = async (userId) => {
  return await Coupon.find({ redeemedBy: userId }).sort({ redeemedAt: -1 });
};

exports.getAllCoupons = async () => {
  return await Coupon.find().populate('assignedTo', 'email').populate('redeemedBy', 'email').sort({ createdAt: -1 });
};

exports.assignCoupons = async (dealerId, coupons) => {
  const updates = coupons.map(code => ({
    updateOne: {
      filter: { code },
      update: { assignedTo: dealerId }
    }
  }));
  await Coupon.bulkWrite(updates);
};

exports.assignCouponsToPainter = async (painterId, codes) => {
  const updates = codes.map(code => ({
    updateOne: {
      filter: { code, assignedTo: { $exists: true } }, // Only assign if already assigned to dealer
      update: { assignedTo: painterId }
    }
  }));
  await Coupon.bulkWrite(updates);
};

exports.getCouponStats = async () => {
  const stats = await Coupon.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};
