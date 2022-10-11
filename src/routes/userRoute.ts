import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { authenticateUser, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.route("/").get(authenticateUser, authorizeRoles("admin"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUserPassword").patch(authenticateUser, updateUserPassword);
router
  .route("/:userId")
  .get(authenticateUser, getSingleUser)
  .patch(authenticateUser, updateUser);

export default router;
