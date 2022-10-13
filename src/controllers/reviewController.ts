import { RequestHandler } from "express";
import { AuthUserRequest } from "../middleware/auth";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import Review from "../models/Review";
import { checkPermissions } from "../helpers";

const createReview: RequestHandler = async (req: AuthUserRequest, res) => {
  const { productId } = req.body as { productId: object };
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new NotFoundError("Product is not valid");
  }

  const userSubmitted = await Review.findOne({
    product: productId,
    user: req.user?.userId,
  });
  if (userSubmitted) {
    throw new BadRequestError("User has submitted a review");
  }

  req.body.user = req.user?.userId;
  const review = await Review.create({ ...req.body, product: productId });
  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews: RequestHandler = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "get all reviews" });
};

const getSingleReview: RequestHandler<{ id: object }> = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new NotFoundError("No product with id provided");
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview: RequestHandler<{ id: string }> = async (
  req: AuthUserRequest,
  res
) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new NotFoundError("No product with id provided");
  }

  checkPermissions(req.user!, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview: RequestHandler<{ id: string }> = async (
  req: AuthUserRequest,
  res
) => {
  const { id } = req.params;

  const review = await Review.findOne({ _id: id });
  if (!review) {
    throw new NotFoundError("No product with id provided");
  }

  checkPermissions(req.user!, review.user);
  await review.remove();

  res.status(StatusCodes.OK).json({ msg: "Review succesSfully deleted" });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
