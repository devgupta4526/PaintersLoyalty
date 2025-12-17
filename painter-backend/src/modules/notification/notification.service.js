const Notification = require('./notification.model');

exports.sendToUser = async (userId, payload) => {
  return Notification.create({
    userId,
    title: payload.title,
    message: payload.message,
    type: payload.type
  });
};

exports.sendToMany = async (userIds, payload) => {
  return Notification.insertMany(
    userIds.map(id => ({
      userId: id,
      title: payload.title,
      message: payload.message,
      type: payload.type
    }))
  );
};

exports.getMyNotifications = async (userId) => {
  return Notification.find({ userId })
    .sort({ createdAt: -1 });
};

exports.getNotificationById = async (id) => {
  return Notification.findById(id);
};

exports.registerDevice = async (userId, token) => {
  // Assuming a Device model, but for now just return success
  return { message: 'Device registered' };
};

exports.markRead = async (userId, id) => {
  return Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  );
};

