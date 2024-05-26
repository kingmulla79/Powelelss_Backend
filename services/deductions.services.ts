import { Response } from "express";
import DeductionModel from "../models/deduction.models";

// get deduction data by id
export const GetDeductionById = async (id: string, res: Response) => {
  const deduction = await DeductionModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    deduction,
  });
};

//get all deductions

export const GetAllDeductions = async (res: Response) => {
  const deductions = await DeductionModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Deductions successfully fetched",
    deductions,
  });
};
