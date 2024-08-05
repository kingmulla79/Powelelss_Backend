import { Response } from "express";
import SaleModel from "../models/sale.model";

// get sale data by id
export const GetSaleById = async (id: string, res: Response) => {
  const sale = await SaleModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    sale,
  });
};

//get all sales
export const GetAllSales = async (res: Response) => {
  const sales = await SaleModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Sales successfully fetched",
    sales,
  });
};
