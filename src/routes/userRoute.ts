import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { authenticateUser } from "../middleware/auth";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/showMe").get(showCurrentUser);
router.route("/updateUserPassword").patch(updateUserPassword);
router.route("/:userId").get(authenticateUser, getSingleUser).patch(updateUser);

export default router;
