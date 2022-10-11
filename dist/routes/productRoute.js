"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
router
    .route("/")
    .post([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.createProduct)
    .get(productController_1.getAllProducts);
router
    .route("/uploadImage")
    .post([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.uploadImage);
router
    .route("/:id")
    .get(productController_1.getSingleProduct)
    .patch([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.updateProduct)
    .delete([auth_1.authenticateUser, (0, auth_1.authorizeRoles)("admin")], productController_1.deleteProduct);
exports.default = router;
