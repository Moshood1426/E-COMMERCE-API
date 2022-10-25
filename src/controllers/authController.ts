import { RequestHandler } from "express";
import User from "../models/User";
import { UserSchemaInterface } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { attachCookiesToRes, createTokenUser } from "../helpers";
import crypto from "crypto";

const register: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };
  const userExist = await User.findOne({ email: email });

  if (userExist) {
    throw new BadRequestError("User with email exists");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ ...req.body, role });

  const tokenUser = createTokenUser(user);
  attachCookiesToRes(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//login functionality
const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    throw new BadRequestError("email and password cannot be empty");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new BadRequestError("User has not been registered");
  }

  const passwordIsValid = await user.comparePassword!(password);
  if (!passwordIsValid) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const tokenUser = createTokenUser(user);

  attachCookiesToRes(res, tokenUser);
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout: RequestHandler = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(StatusCodes.OK).json({ msg: "User logged out" });
};

export { register, login, logout };
