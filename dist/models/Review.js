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
        ref: "User",
        required: true,
    },
    product: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Product",
        required: true,
    },
}, { timestamps: true });
ReviewSchema.statics.calculateAverageRatings = async function (productId) {
    //set up aggregate pipeline
};
ReviewSchema.post('save', async function () {
    //set up calculate average ratings
});
ReviewSchema.post('remove', async function () {
    //set up calculate average ratings
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
