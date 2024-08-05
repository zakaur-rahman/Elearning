import dotenv from "dotenv";
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "../database/redis";

dotenv.config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none";
  secure?: boolean;
}

// Parse environment variables with fallback values
const accessTokenExpires = parseInt(
  process.env.ACCESS_TOKEN_EXPIRES || "300",
  10
);
const refreshTokenExpires = parseInt(
  process.env.REFRESH_TOKEN_EXPIRES || "1200",
  10
);

// Options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpires * 60 * 60 * 1000),
  maxAge: accessTokenExpires * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpires * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpires * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Upload session to redis
  redis.set(user._id, JSON.stringify(user) as any);

  // Only set secure to true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }

  // Set cookies and send response
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    accessToken,
    user,
    success: true,
  });
};
