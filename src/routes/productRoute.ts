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

const router = express.Router();

router
  .route("/")
  .post([authenticateUser, authorizeRoles("admin")], createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizeRoles("admin")], uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizeRoles("admin")], updateProduct)
  .delete([authenticateUser, authorizeRoles("admin")], deleteProduct);

export default router;
