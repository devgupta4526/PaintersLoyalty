const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: String,
  message: String,

  type: {
    type: String,
    enum: [
      'OFFER',
      'TRAINING',
      'WITHDRAWAL',
      'COMPLAINT',
      'SYSTEM'
    ],
    default: 'SYSTEM'
  },

  isRead: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
