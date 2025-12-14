const service = require('./admin.coupon.service');

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
