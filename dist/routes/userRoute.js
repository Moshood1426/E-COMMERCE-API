"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route("/").get(userController_1.getAllUsers);
router.route("/showMe").get(userController_1.showCurrentUser);
router.route("/updateUserPassword").patch(userController_1.updateUserPassword);
router.route("/:userId").get(auth_1.authenticateUser, userController_1.getSingleUser).patch(userController_1.updateUser);
exports.default = router;
