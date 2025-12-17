const service = require('./admin.notification.service');

exports.sendAll = async (req, res, next) => {
  try {
    res.json(
      await service.sendToAllPainters(req.body)
    );
  } catch (e) {
    next(e);
  }
};

exports.sendUser = async (req, res, next) => {
  try {
    res.json(
      await service.sendToOne(
        req.params.userId,
        req.body
      )
    );
  } catch (e) {
    next(e);
  }
};

exports.sendRegion = async (req, res, next) => {
  try {
    res.json(
      await service.sendToRegion(
        req.params.region,
        req.body
      )
    );
  } catch (e) {
    next(e);
  }
};
