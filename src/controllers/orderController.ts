import { RequestHandler } from "express";
import { AuthUserRequest } from "../middleware/auth";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import Order from "../models/Order";
import { checkPermissions, fakeStripeAPI } from "../helpers";

const createOrder: RequestHandler = async (req: AuthUserRequest, res) => {
  const {
    items: cartItems,
    tax,
    shippingFee,
  } = req.body as {
    tax: number;
    shippingFee: number;
    items: {
      name: string;
      price: number;
      image: string;
      amount: number;
      product: string;
    }[];
  };

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee");
  }

  let orderItems: {
    name: string;
    price: number;
    image: string;
    amount: number;
    product: string | object;
  }[] = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new NotFoundError(`No product with id : ${item.product}`);
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

  const paymentIntent = await fakeStripeAPI(total, "usd");

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user!.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders: RequestHandler = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder: RequestHandler = async (req: AuthUserRequest, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user!, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders: RequestHandler = async (
  req: AuthUserRequest,
  res
) => {
  const orders = await Order.find({ user: req.user!.userId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder: RequestHandler = async (req: AuthUserRequest, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body as { paymentIntentId: string };

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user!, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
