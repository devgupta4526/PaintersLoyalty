const Complaint = require('./complaint.model');

exports.createComplaint = async (userId, data, files) => {
  const imagePaths = files?.map(f => `/uploads/${f.filename}`) || [];

  return Complaint.create({
    userId,
    category: data.category,
    description: data.description,
    images: imagePaths
  });
};

exports.getMyComplaints = async (userId) => {
  return Complaint.find({ userId }).sort({ createdAt: -1 });
};
