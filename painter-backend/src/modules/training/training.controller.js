const service = require('./training.service');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getTrainingsForPainter(req.user.userId));
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

