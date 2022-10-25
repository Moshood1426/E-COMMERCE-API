"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const reviewController_1 = require("../controllers/reviewController");
const router = express_1.default.Router();
router
    .route("/")
    .post([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.createProduct)
    .get(productController_1.getAllProducts);
router
    .route("/uploadImage")
    .post([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.uploadImage);
router
    .route("/:productId")
    .get(productController_1.getSingleProduct)
    .patch([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.updateProduct)
    .delete([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.deleteProduct);
router.route('/:productId/reviews').get(reviewController_1.getSingleProductReviews);
exports.default = router;
