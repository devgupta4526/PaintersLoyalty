const service = require('./coupon.service');

exports.validate = async (req, res, next) => {
  try {
    const result = await service.validateCoupon(req.body.code);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.redeemCoupon = async (req, res, next) => {
  try {
    const result = await service.redeemCoupon(
      req.user.userId,
      req.body.code
    );

    res.json({
      message: 'Coupon redeemed successfully',
      ...result
    });
  } catch (e) {
    next(e);
  }
};

exports.getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await service.getMyCoupons(req.user.userId);
    res.json(coupons);
  } catch (e) {
    next(e);
  }
};
