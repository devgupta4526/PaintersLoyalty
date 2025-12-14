const Withdrawal = require('../withdrawal/withdrawal.model');
const Wallet = require('../wallet/wallet.model');

exports.getAllWithdrawals = async () => {
  return Withdrawal.find().populate('userId').sort({ createdAt: -1 });
};

exports.approveWithdrawal = async (withdrawalId) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) throw new Error('Withdrawal not found');

  withdrawal.status = 'APPROVED';
  await withdrawal.save();

  return withdrawal;
};

exports.rejectWithdrawal = async (withdrawalId, remark) => {
  const withdrawal = await Withdrawal.findById(withdrawalId);
  if (!withdrawal) throw new Error('Withdrawal not found');

  if (withdrawal.status !== 'PENDING') {
    throw new Error('Action not allowed');
  }

  // Refund points
  const wallet = await Wallet.findOne({ userId: withdrawal.userId });
  wallet.balance += withdrawal.points;
  wallet.totalWithdrawn -= withdrawal.points;
  await wallet.save();

  withdrawal.status = 'REJECTED';
  withdrawal.adminRemark = remark;
  await withdrawal.save();

  return withdrawal;
};
