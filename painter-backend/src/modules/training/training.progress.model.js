const mongoose = require('mongoose');

const TrainingProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  trainingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Training' },
  completedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('TrainingProgress', TrainingProgressSchema);

