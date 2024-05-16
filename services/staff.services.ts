// get user by id
import { Response } from "express";
import StaffModel from "../models/staff.models";

// get customer by id
export const GetStaffById = async (id: string, res: Response) => {
  const staff = await StaffModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    staff,
  });
};

//get all users

export const GetAllStaffData = async (res: Response) => {
  const staff_data = await StaffModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    message: "All staff data successfully fetched",
    staff_data,
  });
};
