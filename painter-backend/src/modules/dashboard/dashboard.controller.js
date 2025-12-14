const service = require('./dashboard.service');

exports.getDashboard = async (req, res, next) => {
  try {
    const data = await service.getPainterDashboard(req.user.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};
