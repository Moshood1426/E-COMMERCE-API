import { RequestHandler } from "express";
import { AuthUserRequest } from "../middleware/auth";
import { StatusCodes } from "http-status-codes";

const createProduct: RequestHandler = (req: AuthUserRequest, res) => {
  res.status(200).json({ msg: "create product success", user: req.user});
};

const getAllProducts: RequestHandler = (req, res) => {
  res.status(200).json({ msg: "get all products success" });
};

const getSingleProduct: RequestHandler = (req, res) => {
  res.status(200).json({ msg: "get single product success" });
};

const updateProduct: RequestHandler = (req, res) => {
  res.status(200).json({ msg: "update product success" });
};

const deleteProduct: RequestHandler = (req, res) => {
  res.status(200).json({ msg: "delete product success" });
};

const uploadImage: RequestHandler = (req, res) => {
  res.status(200).json({ msg: "upload success" });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
