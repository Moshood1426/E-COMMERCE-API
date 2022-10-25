"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router
    .route('/')
    .post(auth_1.authenticateUser, orderController_1.createOrder)
    .get(auth_1.authenticateUser, (0, auth_1.authorizeRoles)('admin'), orderController_1.getAllOrders);
router.route('/showAllMyOrders').get(auth_1.authenticateUser, orderController_1.getCurrentUserOrders);
router
    .route('/:id')
    .get(auth_1.authenticateUser, orderController_1.getSingleOrder)
    .patch(auth_1.authenticateUser, orderController_1.updateOrder);
exports.default = router;
