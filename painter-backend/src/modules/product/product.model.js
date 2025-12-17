const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Interior', 'Exterior', 'Primers', 'Putty', 'Other'] },
  description: { type: String, required: true },
  images: [String], // Array of image URLs
  packingSizes: [String], // e.g., ['1L', '5L', '10L']
  recommendedUsage: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);