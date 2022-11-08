"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
//register
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const userExist = await User_1.default.findOne({ email: email });
    if (userExist) {
        throw new errors_1.BadRequestError("User with email exists");
    }
    // first registered user is an admin
    const isFirstAccount = (await User_1.default.countDocuments({})) === 0;
    const role = isFirstAccount ? "admin" : "user";
    const user = await User_1.default.create({ ...req.body, role });
    const tokenUser = (0, helpers_1.createTokenUser)(user);
    (0, helpers_1.attachCookiesToRes)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
};
exports.register = register;
//login functionality
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new errors_1.BadRequestError("email and password cannot be empty");
    }
    const user = await User_1.default.findOne({ email: email });
    if (!user) {
        throw new errors_1.BadRequestError("User has not been registered");
    }
    const passwordIsValid = await user.comparePassword(password);
    if (!passwordIsValid) {
        throw new errors_1.UnauthenticatedError("Invalid credentials");
    }
    const tokenUser = (0, helpers_1.createTokenUser)(user);
    (0, helpers_1.attachCookiesToRes)(res, tokenUser);
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: tokenUser });
};
exports.login = login;
//logout 
const logout = (req, res) => {
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now() + 1000),
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "User logged out" });
};
exports.logout = logout;
