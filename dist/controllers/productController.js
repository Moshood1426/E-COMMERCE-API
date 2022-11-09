"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.deleteProduct = exports.updateProduct = exports.getSingleProduct = exports.getAllProducts = exports.createProduct = void 0;
const http_status_codes_1 = require("http-status-codes");
const Product_1 = __importDefault(require("../models/Product"));
const errors_1 = require("../errors");
const path_1 = __importDefault(require("path"));
//create order
const createProduct = async (req, res) => {
    var _a;
    req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const product = await Product_1.default.create({ ...req.body });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ msg: "create product success", product });
};
exports.createProduct = createProduct;
//get all products
const getAllProducts = async (req, res) => {
    const products = await Product_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ products, count: products.length });
};
exports.getAllProducts = getAllProducts;
//get single product
const getSingleProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product_1.default.findOne({ _id: productId }).populate('reviews');
    if (!product) {
        throw new errors_1.NotFoundError(`product with id ${productId} not found`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
};
exports.getSingleProduct = getSingleProduct;
//update product
const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product_1.default.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new errors_1.NotFoundError(`Product cannot be found`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ product });
};
exports.updateProduct = updateProduct;
//delete product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    const product = await Product_1.default.findOne({ _id: productId });
    if (!product) {
        throw new errors_1.NotFoundError(`product with id ${productId} not found`);
    }
    await product.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Product succesfully deleted" });
};
exports.deleteProduct = deleteProduct;
//upload image
const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new errors_1.BadRequestError("No file was uploaded");
    }
    //the name attribute of the input[type="file"] would be productImage
    //using any type cos the UploadedFile Type doesn't have the object properties
    const productImage = req.files.productImage;
    if (!productImage.mimetype.startsWith("image")) {
        throw new errors_1.BadRequestError("Please upload a valid image");
    }
    const maxSize = 1024 * 1024; // 1MB max
    if (productImage.size > maxSize) {
        throw new errors_1.BadRequestError("File too large");
    }
    const imagePath = path_1.default.join(__dirname, "../public/uploads/" + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(http_status_codes_1.StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};
exports.uploadImage = uploadImage;
