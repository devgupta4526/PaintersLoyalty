const Training = require('./training.model');
const Progress = require('./training.progress.model');

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

exports.completeTraining = async (userId, trainingId) => {
  return Progress.findOneAndUpdate(
    { userId, trainingId },
    { completedAt: new Date() },
    { upsert: true, new: true }
  );
};

