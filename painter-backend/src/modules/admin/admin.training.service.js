const Training = require('../training/training.model');

exports.create = async (data) => Training.create(data);
exports.list = async () => Training.find().sort({ createdAt: -1 });
exports.toggle = async (id, isActive) =>
  Training.findByIdAndUpdate(id, { isActive }, { new: true });
