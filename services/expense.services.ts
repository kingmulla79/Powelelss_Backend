import { Response } from "express";
import ExpenseModel from "../models/expense.model";

// get expense data by id
export const GetExpenseById = async (id: string, res: Response) => {
  const expense = await ExpenseModel.findById(id);
  res.status(200).json({
    success: true,
    message: "Data successfully fetched",
    expense,
  });
};

//get all Expenses

export const GetAllExpenses = async (res: Response) => {
  const expenses = await ExpenseModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "All Expenses successfully fetched",
    expenses,
  });
};
