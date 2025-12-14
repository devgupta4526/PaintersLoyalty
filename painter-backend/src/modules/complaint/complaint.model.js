const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  category: {
    type: String,
    enum: [
      'PRODUCT_ISSUE',
      'DEALER_BEHAVIOUR',
      'PAYMENT_DISPUTE',
      'SERVICE_DELAY',
      'OFFER_SCHEME',
      'APP_TECHNICAL'
    ]
  },

  description: String,

  images: [String],

  status: {
    type: String,
    enum: ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'],
    default: 'NEW'
  },

  adminRemark: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }

}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
