const NotificationService = require('../notification/notification.service');
const Painter = require('../painter/painter.model');


exports.sendToAllPainters = async (payload) => {
  const painters = await Painter.find().select('userId');
  const ids = painters.map(p => p.userId);
  return NotificationService.sendToMany(ids, payload);
};

exports.sendToOne = async (painterId, payload) => {
  return NotificationService.sendToUser(painterId, payload);
};

exports.sendToRegion = async (region, payload) => {
  const painters = await Painter.find({ region }).select('userId');
  const ids = painters.map(p => p.userId);
  return NotificationService.sendToMany(ids, payload);
};

