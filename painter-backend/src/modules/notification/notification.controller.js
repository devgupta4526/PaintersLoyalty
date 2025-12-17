const service = require('./notification.service');

exports.myNotifications = async (req, res, next) => {
  try {
    res.json(
      await service.getMyNotifications(req.user.userId)
    );
  } catch (e) {
    next(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    res.json(
      await service.getNotificationById(req.params.id)
    );
  } catch (e) {
    next(e);
  }
};

exports.registerDevice = async (req, res, next) => {
  try {
    res.json(
      await service.registerDevice(req.user.userId, req.body.token)
    );
  } catch (e) {
    next(e);
  }
};

exports.read = async (req, res, next) => {
  try {
    res.json(
      await service.markRead(
        req.user.userId,
        req.params.id
      )
    );
  } catch (e) {
    next(e);
  }
};
