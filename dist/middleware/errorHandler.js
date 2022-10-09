"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const errorHandlerMiddleware = (err, req, res, next) => {
    //custom error declaration
    let customError = {
        statusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later",
    };
    if (err instanceof errors_1.UnauthenticatedError) {
        customError.statusCode = err.statusCode;
    }
    //catches mongoose validation error
    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",");
        customError.statusCode = 400;
    }
    //cathes mongoose unique error
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }
    //cacthes mongoose cast error
    if (err.name === "CastError") {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.default = errorHandlerMiddleware;
