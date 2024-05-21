import { Request, Response, NextFunction } from "express";
import AllowanceModel, { IAllowances } from "../models/allowances.model";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import StaffModel from "../models/staff.models";
import {
  GetAllAllowances,
  GetAllowanceById,
} from "../services/allowances.services";

export const AllowanceEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_no, arrears, month, year, imprest_amount, transport, house } =
        req.body as IAllowances;
      if (
        !id_no &&
        !arrears &&
        !month &&
        !year &&
        !imprest_amount &&
        !transport &&
        !house
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

      await AllowanceModel.create({
        staff_member: staff._id,
        id_no,
        arrears,
        month,
        year,
        imprest_amount,
        transport,
        house,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Allowance data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The allowance data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single allowances data
export const SingleAllowanceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetAllowanceById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//allowance data
export const AllAllowancesData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllAllowances(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAllowancesUpdate {
  id_no: string;
  arrears: string;
  month: string;
  year: string;
  imprest_amount: string;
  transport: string;
  house: string;
}
//update allowance data
export const UpdateAllowanceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_no, arrears, month, year, imprest_amount, transport, house } =
        req.body as IAllowancesUpdate;

      const { id } = req.params;

      if (
        !id_no &&
        !arrears &&
        !month &&
        !year &&
        !imprest_amount &&
        !transport &&
        !house
      ) {
        return next(
          new ErrorHandler("There is no information provided as an update", 422)
        );
      }

      const staff = await StaffModel.findOne({ id_no: id_no });
      if (!staff) {
        return next(
          new ErrorHandler(
            "There is no staff member with the specified id number",
            500
          )
        );
      }
      const allowance = await AllowanceModel.findById(id);
      if (!allowance) {
        new ErrorHandler("There is no staff with the specified id", 409);
      }
      if (allowance && id_no) {
        allowance.id_no = id_no;
        allowance.staff_member = staff._id;
      }
      if (allowance && arrears) {
        allowance.arrears = arrears;
      }
      if (allowance && month) {
        allowance.month = month;
      }
      if (allowance && imprest_amount) {
        allowance.imprest_amount = imprest_amount;
      }
      if (allowance && year) {
        allowance.year = year;
      }
      if (allowance && transport) {
        allowance.transport = transport;
      }
      if (allowance && house) {
        allowance.house = house;
      }
      await allowance
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            allowance,
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

// delete allowance
export const DeleteAllowanceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const allowance = await AllowanceModel.findByIdAndDelete(id);
      if (!allowance) {
        return next(new ErrorHandler("The allowance doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The allowance data successfully deleted`,
        allowance,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
