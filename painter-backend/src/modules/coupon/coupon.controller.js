const service = require('./coupon.service');

exports.redeemCoupon = async (req, res, next) => {
  try {
    const result = await service.redeemCoupon(
      req.user.userId,
      req.body.couponCode
    );

    res.json({
      message: 'Coupon redeemed successfully',
      ...result
    });
  } catch (e) {
    next(e);
  }
};
