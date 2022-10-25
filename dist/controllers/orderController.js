"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.createOrder = exports.getCurrentUserOrders = exports.getSingleOrder = exports.getAllOrders = void 0;
const http_status_codes_1 = require("http-status-codes");
const Product_1 = __importDefault(require("../models/Product"));
const errors_1 = require("../errors");
const Order_1 = __importDefault(require("../models/Order"));
const helpers_1 = require("../helpers");
const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee, } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new errors_1.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
        throw new errors_1.BadRequestError("Please provide tax and shipping fee");
    }
    let orderItems = [];
    let subtotal = 0;
    for (const item of cartItems) {
        const dbProduct = await Product_1.default.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new errors_1.NotFoundError(`No product with id : ${item.product}`);
        }
        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id,
        };
        // add item to order
        orderItems = [...orderItems, singleOrderItem];
        // calculate subtotal
        subtotal += item.amount * price;
    }
    // calculate total
    const total = tax + shippingFee + subtotal;
    const paymentIntent = await (0, helpers_1.fakeStripeAPI)(total, "usd");
    const order = await Order_1.default.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });
    res
        .status(http_status_codes_1.StatusCodes.CREATED)
        .json({ order, clientSecret: order.clientSecret });
};
exports.createOrder = createOrder;
const getAllOrders = async (req, res) => {
    const orders = await Order_1.default.find({});
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
};
exports.getAllOrders = getAllOrders;
const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order_1.default.findOne({ _id: orderId });
    if (!order) {
        throw new errors_1.NotFoundError(`No order with id : ${orderId}`);
    }
    (0, helpers_1.checkPermissions)(req.user, order.user);
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
};
exports.getSingleOrder = getSingleOrder;
const getCurrentUserOrders = async (req, res) => {
    const orders = await Order_1.default.find({ user: req.user.userId });
    res.status(http_status_codes_1.StatusCodes.OK).json({ orders, count: orders.length });
};
exports.getCurrentUserOrders = getCurrentUserOrders;
const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order_1.default.findOne({ _id: orderId });
    if (!order) {
        throw new errors_1.NotFoundError(`No order with id : ${orderId}`);
    }
    (0, helpers_1.checkPermissions)(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = "paid";
    await order.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ order });
};
exports.updateOrder = updateOrder;
