const Training = require('./training.model');
const Progress = require('./training.progress.model');

exports.getCategories = async () => {
  return await Training.distinct('category');
};

exports.getTrainingsForPainter = async (userId) => {
  const trainings = await Training.find({ isActive: true })
    .sort({ createdAt: -1 });

  const progress = await Progress.find({ userId });

  return trainings.map(t => ({
    ...t.toObject(),
    completed: progress.some(
      p => p.trainingId.toString() === t._id.toString()
    ),
    isNew: (Date.now() - t.createdAt) / (1000 * 60 * 60 * 24) <= 7
  }));
};

exports.getMyTrainings = async (userId) => {
  const progress = await Progress.find({ userId }).populate('trainingId');
  return progress.map(p => p.trainingId);
};

exports.getTrainingProgress = async (userId, trainingId) => {
  return await Progress.findOne({ userId, trainingId }).populate('trainingId');
};

exports.completeTraining = async (userId, trainingId) => {
  return Progress.findOneAndUpdate(
    { userId, trainingId },
    { completedAt: new Date() },
    { upsert: true, new: true }
  );
};

