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

exports.getYearly = async (req, res, next) => {
  try {
    const data = await service.getYearlyEarnings(req.user.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { type, month, quarter, year } = req.query;
    const data = await service.getTransactions(req.user.userId, { type, month, quarter, year });
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getWithdrawalEligibility = async (req, res, next) => {
  try {
    const data = await service.getWithdrawalEligibility(req.user.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};
