const User = require('./auth.model');
const Otp = require('./otp.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.sendOtp = async ({ mobile, email }) => {
  const query = email ? { $or: [{ mobile }, { email }] } : { mobile };
  let user = await User.findOne(query);
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
  const query = email ? { $or: [{ mobile }, { email }] } : { mobile };
  const user = await User.findOne(query);
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

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !user.password) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  if (!user.isActive) throw new Error('Account is blocked');

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, role: user.role };
};

exports.registerAdmin = async ({ email, password, role = 'ADMIN' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword, role, isVerified: true });
  return user;
};
