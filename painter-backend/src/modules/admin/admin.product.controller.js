const service = require('../product/product.service');

exports.create = async (req, res, next) => {
  try {
    const product = await service.createProduct(req.body);
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await service.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const product = await service.deleteProduct(req.params.id);
    res.json(product);
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const products = await service.getAllProducts();
    res.json(products);
  } catch (e) {
    next(e);
  }
};