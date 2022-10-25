"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const fakeStripeAPI = async (amount, currency) => {
    const client_secret = crypto_1.default.randomBytes(24).toString("base64").slice(0, 24);
    return { client_secret, amount };
};
exports.default = fakeStripeAPI;
