require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { CatchAssyncError } from "./catchAssyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../database/redis";

export const isAuthenticated = CatchAssyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = req.cookies.access_token as string;
      if (!access_token)
        return next(new ErrorHandler("Please login to access this page!", 400));

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_SECRET_KEY as string
      ) as JwtPayload;
      if (!decoded) {
        return next(new ErrorHandler("Unauthorized access denied!", 400));
      }

      const user = await redis.get(decoded.id);
      if (!user) return next(new ErrorHandler("User not found", 400));
      (req as any).user = JSON.parse(user);
      next();
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${(req as any).user?.role} is not allowed to access this page`,
          400
        )
      );
    }
    next();
  };
};
