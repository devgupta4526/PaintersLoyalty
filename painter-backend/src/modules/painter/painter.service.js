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

exports.getPortfolio = async (userId) => {
  const profile = await PainterProfile.findOne({ userId });
  const totalEarnings = profile.totalPointsEarned || 0;
  const couponsRedeemed = profile.totalCouponsRedeemed || 0;
  return {
    ...profile.toObject(),
    totalEarnings,
    couponsRedeemed
  };
};

exports.uploadPhoto = async (userId, file) => {
  const photoUrl = `/uploads/profiles/${file.filename}`;
  return PainterProfile.findOneAndUpdate(
    { userId },
    { photoUrl },
    { new: true }
  );
};

exports.uploadKyc = async (userId, file) => {
  const idProofUrl = `/uploads/kyc/${file.filename}`;
  return PainterProfile.findOneAndUpdate(
    { userId },
    { idProofUrl, kycStatus: 'PENDING' },
    { new: true }
  );
};

exports.addSkills = async (userId, skills) => {
  return PainterProfile.findOneAndUpdate(
    { userId },
    { $addToSet: { skills: { $each: skills } } },
    { new: true }
  );
};

exports.updateBankDetails = async (userId, bankDetails) => {
  return PainterProfile.findOneAndUpdate(
    { userId },
    { bankDetails },
    { new: true }
  );
};
