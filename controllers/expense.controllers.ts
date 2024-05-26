import { Request, Response, NextFunction } from "express";
import ExpenseModel, { IExpenses } from "../models/expense.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { GetAllExpenses, GetExpenseById } from "../services/expense.services";

export const ExpenseCodeRetrieve = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latest_expense = await ExpenseModel.findOne().sort({
        createdAt: -1,
      });

      if (!latest_expense) {
        // there is no record saved yet, count defaults to 1
        res.status(200).json({
          success: true,
          message: "Count successfully retrieved",
          count: 1,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Count successfully retrieved",
          count: latest_expense.count + 1,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const ExpenseEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, service_item_name, total_cost, recorded_by, date, count } =
        req.body as IExpenses;
      if (
        !code &&
        !service_item_name &&
        !total_cost &&
        !recorded_by &&
        !date &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      await ExpenseModel.create({
        code,
        service_item_name,
        total_cost,
        recorded_by,
        date,
        count,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Expense data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The expense data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single expense data
export const SingleExpenseData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetExpenseById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//expense data
export const AllExpensesData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllExpenses(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update expense data
export const UpdateExpenseData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, service_item_name, total_cost, recorded_by, date, count } =
        req.body as IExpenses;
      if (
        !code &&
        !service_item_name &&
        !total_cost &&
        !recorded_by &&
        !date &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const { id } = req.params;

      const expense = await ExpenseModel.findById(id);
      if (!expense) {
        new ErrorHandler("There is no expense with the specified id", 409);
      }
      if (expense && code) {
        expense.code = code;
      }
      if (expense && service_item_name) {
        expense.service_item_name = service_item_name;
      }
      if (expense && total_cost) {
        expense.total_cost = total_cost;
      }
      if (expense && recorded_by) {
        expense.recorded_by = recorded_by;
      }
      if (expense && date) {
        expense.date = date;
      }
      if (expense && count) {
        expense.count = count;
      }

      await expense
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            expense,
          });
        })
        .catch((error: any) => {
          return next(new ErrorHandler(error.message, 500));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete expense
export const DeleteExpenseData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const expense = await ExpenseModel.findByIdAndDelete(id);
      if (!expense) {
        return next(new ErrorHandler("The expense doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The expense data successfully deleted`,
        expense,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
