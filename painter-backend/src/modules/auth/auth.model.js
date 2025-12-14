const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['PAINTER', 'DEALER', 'ADMIN'], default: 'PAINTER' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
