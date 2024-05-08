// get user by id
import { Response } from "express";
import { redis } from "../utils/Redis";
import UserModel from "../models/user.model";

export const GetUserById = async (id: string, res: Response) => {
  const UserJSON = await redis.get(id);
  if (UserJSON) {
    const user = JSON.parse(UserJSON);
    res.status(200).json({
      success: true,
      user,
    });
  }
};

//get all users

export const GetAllUsers = async (res: Response) => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    message: "All users successfully fetched",
    users,
  });
};
