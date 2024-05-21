import { Response } from "express";
import AllowanceModel from "../models/allowances.model";

// get allowance data by id
export const GetAllowanceById = async (id: string, res: Response) => {
  const allowance = await AllowanceModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    allowance,
  });
};

//get all allowances

export const GetAllAllowances = async (res: Response) => {
  const allowances = await AllowanceModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Allowances successfully fetched",
    allowances,
  });
};
