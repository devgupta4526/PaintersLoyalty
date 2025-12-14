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
