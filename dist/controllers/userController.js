"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = exports.updateUser = exports.showCurrentUser = exports.getSingleUser = exports.getAllUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = async (req, res) => {
    const users = await User_1.default.find({ role: "user" }).select("-password");
    res.status(http_status_codes_1.StatusCodes.OK).json({ users });
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    const { userId } = req.params;
    console.log(req.user);
    const user = await User_1.default.find({ _id: userId }).select("-password");
    if (!user) {
        throw new errors_1.BadRequestError(`user with id: ${userId} does not exist`);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
};
exports.getSingleUser = getSingleUser;
const showCurrentUser = (req, res) => {
    res.json({ msg: "show current user" });
};
exports.showCurrentUser = showCurrentUser;
const updateUser = (req, res) => {
    res.json({ msg: "update user" });
};
exports.updateUser = updateUser;
const updateUserPassword = (req, res) => {
    res.json({ msg: "update password" });
};
exports.updateUserPassword = updateUserPassword;
