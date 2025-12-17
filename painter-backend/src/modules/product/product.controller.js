const service = require('./product.service');

exports.getAll = async (req, res, next) => {
  try {
    const products = await service.getAllProducts();
    res.json(products);
  } catch (e) {
    next(e);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await service.getProductById(req.params.id);
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const products = await service.getProductsByCategory(category);
    res.json(products);
  } catch (e) {
    next(e);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    const products = await service.searchProducts(q);
    res.json(products);
  } catch (e) {
    next(e);
  }
};

exports.filter = async (req, res, next) => {
  try {
    const { category, packingSize } = req.query;
    const products = await service.filterProducts({ category, packingSize });
    res.json(products);
  } catch (e) {
    next(e);
  }
};