const service = require('./wallet.service');

exports.getSummary = async (req, res, next) => {
  try {
    const wallet = await service.getWalletSummary(req.user.userId);
    res.json(wallet);
  } catch (e) {
    next(e);
  }
};

exports.getMonthly = async (req, res, next) => {
  try {
    const data = await service.getMonthlyEarnings(
      req.user.userId,
      Number(req.query.year)
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getQuarterly = async (req, res, next) => {
  try {
    const data = await service.getQuarterlyEarnings(
      req.user.userId,
      Number(req.query.year)
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};
