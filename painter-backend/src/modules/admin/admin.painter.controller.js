const PainterProfile = require('../painter/painter.model');

exports.getAllPainters = async (req, res, next) => {
  try {
    const painters = await PainterProfile.find().populate('userId', 'mobile email').populate('dealerId', 'fullName');
    res.json(painters);
  } catch (e) {
    next(e);
  }
};

exports.approveKyc = async (req, res, next) => {
  try {
    const painter = await PainterProfile.findByIdAndUpdate(req.params.id, { isKycApproved: true }, { new: true });
    res.json(painter);
  } catch (e) {
    next(e);
  }
};

exports.rejectKyc = async (req, res, next) => {
  try {
    const painter = await PainterProfile.findByIdAndUpdate(req.params.id, { isKycApproved: false }, { new: true });
    res.json(painter);
  } catch (e) {
    next(e);
  }
};

exports.blockPainter = async (req, res, next) => {
  try {
    const painter = await PainterProfile.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json(painter);
  } catch (e) {
    next(e);
  }
};

exports.unblockPainter = async (req, res, next) => {
  try {
    const painter = await PainterProfile.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json(painter);
  } catch (e) {
    next(e);
  }
};