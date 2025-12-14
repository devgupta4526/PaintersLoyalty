const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
  title: String,
  description: String,
  youtubeUrl: String,
  thumbnail: String,

  category: {
    type: String,
    enum: [
      'PRODUCT_KNOWLEDGE',
      'PAINTING_TECHNIQUE',
      'SAFETY',
      'TOOLS_EQUIPMENT',
      'SALES'
    ]
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Training', TrainingSchema);
