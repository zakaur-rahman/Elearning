import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error";

  //wrong mongoDB id Error
  if (err.code === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key error
  if (err.code === "11000") {
    const message = `Duplicate ${Object.keys(err.keyValue)} enteres`;
    err = new ErrorHandler(message, 400);
  }

  //Wrong JWT token
  if(err.name === 'JsonWebTokenError'){
    const message = 'Invalid Token! Please try again.';
    err = new ErrorHandler(message, 401);
  }

  //JWT expired
  if (err.name === "TokenExpiredError") {
    const message = "Session Expired... Please Login again.";
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
};
