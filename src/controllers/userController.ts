import { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import User from "../models/User";
import { AuthUserRequest } from "../middleware/auth";
import { attachCookiesToRes, createTokenUser } from "../helpers";

const getAllUsers: RequestHandler = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: AuthUserRequest, res: Response) => {
  const { userId } = req.params;

  const user = await User.find({ _id: userId }).select("-password");
  if (!user) {
    throw new BadRequestError(`user with id: ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser: RequestHandler = (req: AuthUserRequest, res) => {
  //fetches user for an urgent request like refreshing
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser: RequestHandler = async (req: AuthUserRequest, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ _id: req.user?.userId });
  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  user.email = email;
  user.name = name;
  await user.save();

  const tokenUser = createTokenUser(user);
  attachCookiesToRes(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword: RequestHandler = async (
  req: AuthUserRequest,
  res
) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Kindly fill all necessary input");
  }

  const user = await User.findOne({ _id: req.user?.userId });
  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  const passwordIsValid = await user.comparePassword!(oldPassword);
  if (!passwordIsValid) {
    throw new UnauthenticatedError("Old password is incorrect!");
  }

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Password updated succesfully" });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
