"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ReviewSchema = new mongoose_1.default.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please provide ratings"],
    },
    title: {
        type: String,
        trim: true,
        required: [true, "Please provide review title"],
        maxLength: 100,
    },
    comment: {
        type: String,
        requred: [true, "Please provide comment"],
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    product: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "products",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Review", ReviewSchema);
