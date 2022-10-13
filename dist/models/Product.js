"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Review_1 = __importDefault(require("./Review"));
const ProductSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Please provide product name"],
        maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please provide product price"],
        default: 0,
    },
    description: {
        type: String,
        required: [true, "Please provide product description"],
        maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    image: {
        type: String,
        default: "/uploads/example.jpeg",
    },
    category: {
        type: String,
        required: [true, "Please provide product category"],
        enum: {
            values: ["office", "kitchen", "bedroom"],
            message: "{VALUE} is not supported",
        },
    },
    company: {
        type: String,
        required: [true, "Please provide company"],
        enum: {
            values: ["ikea", "liddy", "marcos"],
            message: "{VALUE} is not supported",
        },
    },
    colors: {
        type: [String],
        default: ["#222"],
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    freeShipping: {
        type: Boolean,
        default: false,
    },
    inventory: {
        type: Number,
        required: true,
        default: 15,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
ProductSchema.pre("remove", async function () {
    await Review_1.default.deleteMany({ product: this._id });
});
exports.default = mongoose_1.default.model("Product", ProductSchema);
