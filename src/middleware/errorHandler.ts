import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors";

const errorHandlerMiddleware = (
  err: TypeError | UnauthenticatedError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //custom error declaration
  let customError = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err instanceof UnauthenticatedError) {
    customError.statusCode = err.statusCode;
  }

  //catches mongoose validation error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  //cathes mongoose unique error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  //cacthes mongoose cast error
  if (err.name === "CastError") {
    customError.msg = `No item found with id : ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

export default errorHandlerMiddleware;
