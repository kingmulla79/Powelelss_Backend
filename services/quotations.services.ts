import { Response } from "express";
import QuotationModel from "../models/quotation.model";

// get quotation data by id
export const GetQuotationById = async (id: string, res: Response) => {
  const quotation = await QuotationModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    quotation,
  });
};

//get all Quotations
export const GetAllQuotations = async (res: Response) => {
  const quotations = await QuotationModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Quotations successfully fetched",
    quotations,
  });
};
