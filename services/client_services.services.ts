import { Response } from "express";
import ServiceModel from "../models/client_services.models";

// get deduction data by id
export const GetServiceById = async (id: string, res: Response) => {
  const service = await ServiceModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    service,
  });
};

//get all service

export const GetAllServices = async (res: Response) => {
  const service = await ServiceModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Service successfully fetched",
    service,
  });
};
