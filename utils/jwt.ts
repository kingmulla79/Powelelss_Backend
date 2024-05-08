require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./Redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// parse env. variables to intergrate with fallback values
const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "1200",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "5000",
  10
);

//cookie options

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 5 * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 5 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  //lax
  // secure: true,
};
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 5 * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 5 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  // secure: true,
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.AccessToken();
  const refreshToken = user.RefreshToken();

  //upload session to redis
  redis.set(user._id, JSON.stringify(user) as any, "EX", 604800);

  // only set true in production
  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
