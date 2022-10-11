"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateUser = void 0;
const errors_1 = require("../errors");
const helpers_1 = require("../helpers");
const authenticateUser = (req, res, next) => {
    let token;
    // check header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    // check cookies
    else if (req.signedCookies.token) {
        token = req.signedCookies.token;
    }
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
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new errors_1.UnauthorizedError("User not allowed to access this route");
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
