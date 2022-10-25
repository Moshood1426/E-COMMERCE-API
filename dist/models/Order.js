"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SingleOrderItemSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true },
    product: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Product",
        required: true,
    },
});
const OrderSchema = new mongoose_1.default.Schema({
    tax: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
        type: String,
        enum: ["pending", "failed", "paid", "delivered", "canceled"],
        default: "pending",
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
    clientSecret: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", OrderSchema);
