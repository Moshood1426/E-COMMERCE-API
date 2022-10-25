"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermissions = exports.createTokenUser = exports.attachCookiesToRes = exports.verifyJWT = exports.fakeStripeAPI = exports.createJWT = void 0;
const createJWT_1 = __importDefault(require("./createJWT"));
exports.createJWT = createJWT_1.default;
const attachCookiesToRes_1 = require("./attachCookiesToRes");
Object.defineProperty(exports, "verifyJWT", { enumerable: true, get: function () { return attachCookiesToRes_1.verifyJWT; } });
Object.defineProperty(exports, "attachCookiesToRes", { enumerable: true, get: function () { return attachCookiesToRes_1.attachCookiesToRes; } });
const createTokenUser_1 = __importDefault(require("./createTokenUser"));
exports.createTokenUser = createTokenUser_1.default;
const checkPermissions_1 = __importDefault(require("./checkPermissions"));
exports.checkPermissions = checkPermissions_1.default;
const stripeAPI_1 = __importDefault(require("./stripeAPI"));
exports.fakeStripeAPI = stripeAPI_1.default;
