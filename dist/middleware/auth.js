"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
const authenticateUser = (req, res, next) => {
    const { token } = req.signedCookies;
    if (!token) {
        throw new errors_1.UnauthenticatedError("Authentication Invalid");
    }
    try {
        const { name, userId, role } = (0, helpers_1.verifyJWT)({ token });
        req.user = { name, userId, role };
        next();
    }
    catch (error) {
        throw new errors_1.UnauthenticatedError("User cannot access this route");
    }
};
exports.authenticateUser = authenticateUser;
