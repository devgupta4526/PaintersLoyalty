const User = require('./auth.model');
const Otp = require('./otp.model');
const jwt = require('jsonwebtoken');

exports.sendOtp = async ({ mobile, email }) => {
  let user = await User.findOne({ $or: [{ mobile }, { email }] });
  if (!user) {
    user = await User.create({ mobile, email });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    userId: user._id,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  console.log('OTP (DEV):', otp); // replace with SMS/Email later

  return true;
};

exports.verifyOtp = async ({ mobile, email, otp }) => {
  const user = await User.findOne({ $or: [{ mobile }, { email }] });
  if (!user) throw new Error('User not found');

  const record = await Otp.findOne({ userId: user._id, otp });
  if (!record || record.expiresAt < new Date()) {
    throw new Error('Invalid or expired OTP');
  }

  user.isVerified = true;
  await user.save();
  await Otp.deleteMany({ userId: user._id });

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  console.log('Generated Token:', token);

  return { token, isNewUser: true };
};
