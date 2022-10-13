"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === "admin")
        return;
    if (requestUser.userId === resourceUserId.toString())
        return;
    throw new errors_1.UnauthorizedError("Unauthorized to access this route");
};
exports.default = checkPermissions;
