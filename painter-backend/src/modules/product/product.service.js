const Product = require('./product.model');

exports.getAllProducts = async () => {
  return await Product.find({ isActive: true });
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

exports.getProductsByCategory = async (category) => {
  return await Product.find({ category, isActive: true });
};

exports.searchProducts = async (query) => {
  return await Product.find({
    isActive: true,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
};

exports.filterProducts = async (filters) => {
  const query = { isActive: true };
  if (filters.category) query.category = filters.category;
  if (filters.packingSize) query.packingSizes = { $in: [filters.packingSize] };
  return await Product.find(query);
};

exports.createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProduct = async (id) => {
  return await Product.findByIdAndUpdate(id, { isActive: false }, { new: true });
};