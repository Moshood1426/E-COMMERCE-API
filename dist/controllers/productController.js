"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const createProduct = (req, res) => {
    res.status(200).json({ msg: "create product success", user: req.user });
};
exports.createProduct = createProduct;
const getAllProducts = (req, res) => {
    res.status(200).json({ msg: "get all products success" });
};
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => {
    res.status(200).json({ msg: "get single product success" });
};
exports.getSingleProduct = getSingleProduct;
const updateProduct = (req, res) => {
    res.status(200).json({ msg: "update product success" });
};
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => {
    res.status(200).json({ msg: "delete product success" });
};
exports.deleteProduct = deleteProduct;
const uploadImage = (req, res) => {
    res.status(200).json({ msg: "upload success" });
};
exports.uploadImage = uploadImage;
