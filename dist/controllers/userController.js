"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const User_1 = __importDefault(require("../models/User"));
const helpers_1 = require("../helpers");
const getAllUsers = async (req, res) => {
    const users = await User_1.default.find({ role: "user" }).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    const { userId } = req.params;
    const user = await User_1.default.find({ _id: userId }).select("-password");
    if (!user) {
        throw new errors_1.BadRequestError(`user with id: ${userId} does not exist`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
};
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => {
    //fetches user for an urgent request like refreshing
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: req.user });
};
exports.showCurrentUser = showCurrentUser;
const updateUser = async (req, res) => {
    var _a;
    const { email, name } = req.body;
    if (!email || !name) {
        throw new errors_1.BadRequestError("Please provide all values");
    }
    const user = await User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!user) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    user.email = email;
    user.name = name;
    await user.save();
    const tokenUser = (0, helpers_1.createTokenUser)(user);
    (0, helpers_1.attachCookiesToRes)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
};
exports.updateUser = updateUser;
const updateUserPassword = async (req, res) => {
    var _a;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new errors_1.BadRequestError("Kindly fill all necessary input");
    }
    const user = await User_1.default.findOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId });
    if (!user) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    const passwordIsValid = await user.comparePassword(oldPassword);
    if (!passwordIsValid) {
        throw new errors_1.UnauthenticatedError("Old password is incorrect!");
    }
    user.password = newPassword;
    await user.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Password updated succesfully" });
};
exports.updateUserPassword = updateUserPassword;
