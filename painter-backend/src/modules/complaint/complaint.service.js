const Complaint = require('./complaint.model');

exports.getCategories = async () => {
  return ['Product Issue', 'Dealer Behaviour', 'Payment Dispute', 'Service Delay', 'Scheme Problem', 'App/Technical Issue'];
};

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

exports.getComplaintHistory = async (complaintId) => {
  return Complaint.findById(complaintId).populate('userId', 'fullName mobile');
};

exports.assignComplaint = async (complaintId, assignedTo) => {
  return Complaint.findByIdAndUpdate(complaintId, { assignedTo }, { new: true });
};
