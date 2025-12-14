const NotificationService = require('../notification/notification.service');
const User = require('../user/user.model');

exports.sendToAllPainters = async (payload) => {
  const users = await User.find({ role: 'PAINTER' }).select('_id');
  const ids = users.map(u => u._id);
  return NotificationService.sendToMany(ids, payload);
};

exports.sendToOne = async (userId, payload) => {
  return NotificationService.sendToUser(userId, payload);
};

