import express from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController";
import { getSingleProductReviews } from "../controllers/reviewController";

const router = express.Router();

router
  .route("/")
  .post([authenticateUser, authorizeRoles("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizeRoles("admin")], uploadImage);

router
  .route("/:productId")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizeRoles("admin")], updateProduct)
  .delete([authenticateUser, authorizeRoles("admin")], deleteProduct);

router.route('/:productId/reviews').get(getSingleProductReviews);

export default router;
