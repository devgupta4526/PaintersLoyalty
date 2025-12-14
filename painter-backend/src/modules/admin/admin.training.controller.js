const service = require('./admin.training.service');

exports.create = async (req, res, next) => {
  try {
    res.json(await service.create(req.body));
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.json(await service.list());
  } catch (e) {
    next(e);
  }
};

exports.toggle = async (req, res, next) => {
  try {
    res.json(
      await service.toggle(req.params.id, req.body.isActive)
    );
  } catch (e) {
    next(e);
  }
};

