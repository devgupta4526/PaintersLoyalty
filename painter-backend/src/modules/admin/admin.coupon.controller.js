const service = require('./admin.coupon.service');
const couponService = require('../coupon/coupon.service');

exports.generate = async (req, res, next) => {
  try {
    const data = await service.generateCoupons(req.body);
    res.json({
      message: 'Coupons generated',
      total: data.length
    });
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (e) {
    next(e);
  }
};

exports.assign = async (req, res, next) => {
  try {
    await couponService.assignCoupons(req.body.dealerId, req.body.codes);
    res.json({ message: 'Coupons assigned' });
  } catch (e) {
    next(e);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const stats = await couponService.getCouponStats();
    res.json(stats);
  } catch (e) {
    next(e);
  }
};
