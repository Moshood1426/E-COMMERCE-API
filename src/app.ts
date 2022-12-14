import express from "express";
import dotenv from "dotenv";
import path from "path";
import { Request, Response } from "express";

import connectDB from "./db/connect";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

//@ts-ignore
import xss from "xss-clean"; //@ts-ignore
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";

import "express-async-errors";
import notFoundMiddleware from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandler";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import reviewRoute from "./routes/reviewRoute";
import orderRoute from "./routes/orderRoute";
import { StatusCodes } from "http-status-codes";

const app = express();
dotenv.config();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
// app.use(helmet())
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

app.use(express.static(path.join(__dirname, "./public")));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/orders", orderRoute);

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ msg: "Conection successful" });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => {
      console.log("app is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
