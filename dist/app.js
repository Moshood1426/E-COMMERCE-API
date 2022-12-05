"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const connect_1 = __importDefault(require("./db/connect"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//@ts-ignore
const xss_clean_1 = __importDefault(require("xss-clean")); //@ts-ignore
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
require("express-async-errors");
const notFound_1 = __importDefault(require("./middleware/notFound"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productRoute_1 = __importDefault(require("./routes/productRoute"));
const reviewRoute_1 = __importDefault(require("./routes/reviewRoute"));
const orderRoute_1 = __importDefault(require("./routes/orderRoute"));
const http_status_codes_1 = require("http-status-codes");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.set("trust proxy", 1);
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 60,
}));
// app.use(helmet())
app.use((0, cors_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, express_mongo_sanitize_1.default)());
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "./public")));
app.use("/api/v1/auth", authRoute_1.default);
app.use("/api/v1/user", userRoute_1.default);
app.use("/api/v1/product", productRoute_1.default);
app.use("/api/v1/review", reviewRoute_1.default);
app.use("/api/v1/orders", orderRoute_1.default);
app.get("/api/v1", (req, res) => {
    res.status(http_status_codes_1.StatusCodes.OK).json({ msg: "Conection successful" });
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
