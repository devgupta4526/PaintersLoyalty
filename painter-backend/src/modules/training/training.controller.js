const service = require('./training.service');

exports.getCategories = async (req, res, next) => {
  try {
    res.json(await service.getCategories());
  } catch (e) {
    next(e);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getTrainingsForPainter(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.getMy = async (req, res, next) => {
  try {
    res.json(await service.getMyTrainings(req.user.userId));
  } catch (e) {
    next(e);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    res.json(await service.getTrainingProgress(req.user.userId, req.params.id));
  } catch (e) {
    next(e);
  }
};

exports.complete = async (req, res, next) => {
  try {
    res.json(
      await service.completeTraining(
        req.user.userId,
        req.params.id
      )
    );
  } catch (e) {
    next(e);
  }
};

