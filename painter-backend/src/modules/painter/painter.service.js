const PainterProfile = require('./painter.model');
const User = require('../auth/auth.model');

exports.createOrUpdateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  const profile = await PainterProfile.findOneAndUpdate(
    { userId },
    {
      ...data,
      mobile: user.mobile,
      isProfileComplete: true
    },
    { upsert: true, new: true }
  );

  return profile;
};

exports.getProfile = async (userId) => {
  return PainterProfile.findOne({ userId });
};

exports.updateBankDetails = async (userId, bankDetails) => {
  return PainterProfile.findOneAndUpdate(
    { userId },
    { bankDetails },
    { new: true }
  );
};
