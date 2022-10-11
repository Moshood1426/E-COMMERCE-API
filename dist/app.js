"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connect_1 = __importDefault(require("./db/connect"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("express-async-errors");
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const app = (0, express_1.default)();
dotenv_1.default.config();
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/user", userRoute_1.default);
app.use("/api/v1/product", productRoute_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ msg: "connected" });
});
app.use(notFound_1.default);
app.use(errorHandler_1.default);
const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await (0, connect_1.default)(process.env.MONGO_URI);
        app.listen(port, () => {
            console.log("app is listening on port 5000");
        });
    }
    catch (error) {
        console.log(error);
    }
};
start();
