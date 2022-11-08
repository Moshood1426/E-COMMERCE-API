import express from "express";
import dotenv from "dotenv";

import connectDB from "./db/connect";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import "express-async-errors";
import notFoundMiddleware from "./middleware/notFound";
import errorHandlerMiddleware from "./middleware/errorHandler";

import authRoute from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import productRoute from "./routes/productRoute";
import reviewRoute from "./routes/reviewRoute";
import orderRoute from "./routes/orderRoute";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/orders", orderRoute);

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).json({ msg: "connected" });
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
