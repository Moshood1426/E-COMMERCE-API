"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Kindly input user name"],
        trim: true,
        minlength: [3, "Name cannot be less than 3 characters"],
        maxlength: [20, "Name cannot be more than 3 characters"],
    },
    //@ts-ignore
    email: {
        type: String,
        required: [true, "Kindly input user email"],
        unique: true,
        validate: {
            validator: validator_1.default.isEmail,
            message: "Please enter a valid email address",
        },
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password cannot be less than 6 characters"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
});
UserSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcryptjs_1.default.genSalt(10);
    //@ts-ignore
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
UserSchema.methods.comparePassword = async function (passwordInput) {
    const result = await bcryptjs_1.default.compare(passwordInput, this.password);
    return result;
};
exports.default = mongoose_1.default.model("User", UserSchema);
