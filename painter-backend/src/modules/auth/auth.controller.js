const service = require('./auth.service');

exports.sendOtp = async (req, res, next) => {
  try {
    await service.sendOtp(req.body);
    res.json({ message: 'OTP sent successfully' });
  } catch (e) {
    next(e);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const data = await service.verifyOtp(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = await service.login(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.registerAdmin = async (req, res, next) => {
  try {
    const user = await service.registerAdmin(req.body);
    res.json({ message: 'Admin registered', userId: user._id });
  } catch (e) {
    next(e);
  }
};
