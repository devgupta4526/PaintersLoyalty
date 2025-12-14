const service = require('./admin.withdrawal.service');

exports.getWithdrawals = async (req, res, next) => {
  try {
    const data = await service.getAllWithdrawals();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const data = await service.approveWithdrawal(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.reject = async (req, res, next) => {
  try {
    const data = await service.rejectWithdrawal(
      req.params.id,
      req.body.remark
    );
    res.json(data);
  } catch (e) {
    next(e);
  }
};
