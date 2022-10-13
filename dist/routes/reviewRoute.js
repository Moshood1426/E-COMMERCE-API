"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//createReview, getAllReviews, getSingleReview, updateReview, deleteReview
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
router.route("/").get(reviewController_1.getAllReviews).post(auth_1.authenticateUser, reviewController_1.createReview);
router
    .route("/:id")
    .get(reviewController_1.getSingleReview)
    .patch(auth_1.authenticateUser, reviewController_1.updateReview)
    .delete(auth_1.authenticateUser, reviewController_1.deleteReview);
exports.default = router;
