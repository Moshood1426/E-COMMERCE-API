import { RequestHandler } from "express";
import { AuthUserRequest } from "../middleware/auth";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product";
import { BadRequestError, NotFoundError } from "../errors";
import path from "path";

//create order
const createProduct: RequestHandler = async (req: AuthUserRequest, res) => {
  req.body.user = req.user?.userId;
  const product = await Product.create({ ...req.body });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "create product success", product });
};

//get all products
const getAllProducts: RequestHandler = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

//get single product
const getSingleProduct: RequestHandler<{ productId: string }> = async (
  req,
  res
) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate('reviews')
  if (!product) {
    throw new NotFoundError(`product with id ${productId} not found`);
  }

  res.status(StatusCodes.OK).json({ product });
};

//update product
const updateProduct: RequestHandler<{ productId: string }> = async (
  req,
  res
) => {
  const { productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new NotFoundError(`User with id:${productId} not registered`);
  }

  res.status(StatusCodes.OK).json({ product });
};

//delete product
const deleteProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`product with id ${productId} not found`);
  }

  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "Product succesfully deleted" });
};

//upload image
const uploadImage: RequestHandler = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file was uploaded");
  }

  //the name attribute of the input[type="file"] would be productImage
  //using any type cos the UploadedFile Type doesn't have the object properties
  const productImage: any = req.files.productImage;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload a valid image");
  }

  const maxSize = 1024 * 1024// 1MB max
  if (productImage.size > maxSize) {
    throw new BadRequestError("File too large");
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
