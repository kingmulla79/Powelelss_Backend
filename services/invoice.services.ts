import { Response } from "express";
import InvoiceModel from "../models/invoice.model";

// get invoice data by id
export const GetInvoiceById = async (id: string, res: Response) => {
  const invoice = await InvoiceModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    invoice,
  });
};

//get all invoices
export const GetAllInvoices = async (res: Response) => {
  const invoices = await InvoiceModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Invoices successfully fetched",
    invoices,
  });
};
