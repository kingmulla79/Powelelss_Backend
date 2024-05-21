// get user by id
import { Response } from "express";
import ItemModel from "../models/item.models";

// get customer by id
export const GetItemById = async (id: string, res: Response) => {
  const item = await ItemModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    item,
  });
};

//get all users

export const GetAllItems = async (res: Response) => {
  const items = await ItemModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All items successfully fetched",
    items,
  });
};
