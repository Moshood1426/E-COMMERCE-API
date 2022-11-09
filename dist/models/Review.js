"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Product_1 = __importDefault(require("./Product"));
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
    var _a, _b;
    const result = await this.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);
    try {
        await Product_1.default.findOneAndUpdate({ _id: productId }, {
            averageRating: Math.ceil(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.averageRating) || 0),
            numOfReviews: ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.numOfReviews) || 0,
        });
    }
    catch (error) {
        console.log(error);
    }
};
ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});
ReviewSchema.post('remove', async function () {
    //@ts-ignore
    await this.constructor.calculateAverageRating(this.product);
});
exports.default = mongoose_1.default.model("Review", ReviewSchema);
