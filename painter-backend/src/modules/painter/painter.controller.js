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

exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await service.getPortfolio(req.user.userId);
    res.json(portfolio);
  } catch (e) {
    next(e);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const profile = await service.uploadPhoto(req.user.userId, req.file);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

exports.uploadKyc = async (req, res, next) => {
  try {
    const profile = await service.uploadKyc(req.user.userId, req.file);
    res.json(profile);
  } catch (e) {
    next(e);
  }
};

exports.addSkills = async (req, res, next) => {
  try {
    const profile = await service.addSkills(req.user.userId, req.body.skills);
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
