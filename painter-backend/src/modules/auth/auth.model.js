const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  mobile: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // Added for admin login
  role: { type: String, enum: ['PAINTER', 'DEALER', 'ADMIN'], default: 'PAINTER' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
