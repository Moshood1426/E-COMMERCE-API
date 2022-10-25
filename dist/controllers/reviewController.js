"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleProductReviews = exports.deleteReview = exports.updateReview = exports.getSingleReview = exports.getAllReviews = exports.createReview = void 0;
const http_status_codes_1 = require("http-status-codes");
const Product_1 = __importDefault(require("../models/Product"));
const errors_1 = require("../errors");
const Review_1 = __importDefault(require("../models/Review"));
const helpers_1 = require("../helpers");
const createReview = async (req, res) => {
    var _a, _b;
    const { productId } = req.body;
    const isValidProduct = await Product_1.default.findOne({ _id: productId });
    if (!isValidProduct) {
        throw new errors_1.NotFoundError("Product is not valid");
    }
    const userSubmitted = await Review_1.default.findOne({
        product: productId,
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
    });
    if (userSubmitted) {
        throw new errors_1.BadRequestError("User has submitted a review");
    }
    req.body.user = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const review = await Review_1.default.create({ ...req.body, product: productId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
};
exports.createReview = createReview;
const getAllReviews = async (req, res) => {
    const reviews = await Review_1.default.find({}).populate({
        path: "product",
        select: "name company price",
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
};
exports.getAllReviews = getAllReviews;
const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params;
    const review = await Review_1.default.findOne({ _id: reviewId });
    if (!review) {
        throw new errors_1.NotFoundError("No product with id provided");
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
};
exports.getSingleReview = getSingleReview;
const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const review = await Review_1.default.findOne({ _id: id });
    if (!review) {
        throw new errors_1.NotFoundError("No product with id provided");
    }
    (0, helpers_1.checkPermissions)(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ review });
};
exports.updateReview = updateReview;
const deleteReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review_1.default.findOne({ _id: id });
    if (!review) {
        throw new errors_1.NotFoundError("No product with id provided");
    }
    (0, helpers_1.checkPermissions)(req.user, review.user);
    await review.remove();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Review succesSfully deleted" });
};
exports.deleteReview = deleteReview;
//to get single product reviews as an alternative to using virtuals
const getSingleProductReviews = async (req, res) => {
    const { productId } = req.params;
    const reviews = await Review_1.default.find({ product: productId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ reviews, count: reviews.length });
};
exports.getSingleProductReviews = getSingleProductReviews;
