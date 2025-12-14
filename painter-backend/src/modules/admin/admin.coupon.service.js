const Coupon = require('../coupon/coupon.model');

const generateCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

exports.generateCoupons = async ({ count, points, dealerId }) => {
  const coupons = [];

  for (let i = 0; i < count; i++) {
    coupons.push({
      code: generateCode(),
      points,
      dealerId
    });
  }

  return Coupon.insertMany(coupons);
};
