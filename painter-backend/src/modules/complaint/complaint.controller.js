const service = require('./complaint.service');

exports.getCategories = async (req, res, next) => {
  try {
    res.json(await service.getCategories());
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const complaint = await service.createComplaint(
      req.user.userId,
      req.body,
      req.files
    );
    res.json(complaint);
  } catch (e) {
    next(e);
  }
};

exports.myComplaints = async (req, res, next) => {
  try {
    const data = await service.getMyComplaints(req.user.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const data = await service.getComplaintHistory(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};
