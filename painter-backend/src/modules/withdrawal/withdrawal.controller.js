const service = require('./withdrawal.service');

exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { type, points } = req.body;
    const withdrawal = await service.requestWithdrawal(
      req.user.userId,
      type,
      points
    );
    res.json(withdrawal);
  } catch (e) {
    next(e);
  }
};

exports.getMyWithdrawals = async (req, res, next) => {
  try {
    const data = await service.getUserWithdrawals(req.user.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

