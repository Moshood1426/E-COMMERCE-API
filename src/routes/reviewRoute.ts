//createReview, getAllReviews, getSingleReview, updateReview, deleteReview
import express from "express";
import { authenticateUser } from "../middleware/auth";
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController";

const router = express.Router();

router.route("/").get(getAllReviews).post(authenticateUser, createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
