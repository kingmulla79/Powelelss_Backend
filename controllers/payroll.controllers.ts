import { Request, Response, NextFunction } from "express";
import PayrollModel, { IPayroll } from "../models/payroll.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import StaffModel from "../models/staff.models";

export const PayrollEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        id_no,
        net_salary,
        remitted_amount,
        outstanding_amount,
        date_of_payment,
      } = req.body as IPayroll;
      if (
        !id_no &&
        !net_salary &&
        !remitted_amount &&
        !outstanding_amount &&
        !date_of_payment
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }
      const staff = await StaffModel.findOne({ id_no: id_no });
      if (!staff) {
        return next(
          new ErrorHandler(
            "There is no staff member with the specified id number",
            409
          )
        );
      }

      await PayrollModel.create({
        staff_member: staff._id,
        id_no,
        net_salary,
        remitted_amount,
        outstanding_amount,
        date_of_payment,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Payroll data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The payroll data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
