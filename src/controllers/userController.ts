import { RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import User from "../models/User";
import { AuthUserRequest } from "../middleware/auth";

const getAllUsers: RequestHandler = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: AuthUserRequest, res: Response) => {
  const { userId } = req.params;
  console.log(req.user)
  const user = await User.find({ _id: userId }).select("-password");
  if (!user) {
    throw new BadRequestError(`user with id: ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser: RequestHandler = (req, res) => {
  res.json({ msg: "show current user" });
};

const updateUser: RequestHandler = (req, res) => {
  res.json({ msg: "update user" });
};

const updateUserPassword: RequestHandler = (req, res) => {
  res.json({ msg: "update password" });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
