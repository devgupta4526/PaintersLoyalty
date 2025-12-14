const service = require('./painter.service');

exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const profile = await service.createOrUpdateProfile(req.user.userId, req.body);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await service.getProfile(req.user.userId);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

exports.updateBankDetails = async (req, res, next) => {
  try {
    const profile = await service.updateBankDetails(req.user.userId, req.body);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};
