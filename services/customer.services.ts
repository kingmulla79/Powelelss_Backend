import { Response } from "express";
import CustomerModel from "../models/customer.models";

// get customer by id
export const GetCustomerById = async (id: string, res: Response) => {
  const customer = await CustomerModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    customer,
  });
};

//get all users

export const GetAllCustomers = async (res: Response) => {
  const customers = await CustomerModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All customers successfully fetched",
    customers,
  });
};
