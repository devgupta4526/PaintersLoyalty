const service = require('./admin.offer.service');

exports.create = async (req, res, next) => {
  try {
    res.json(
      await service.createOffer(req.body, req.user.userId)
    );
  } catch (e) {
    next(e);
  }
};

exports.status = async (req, res, next) => {
  try {
    res.json(
      await service.updateStatus(req.params.id, req.body.status)
    );
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (e) {
    next(e);
  }
};

