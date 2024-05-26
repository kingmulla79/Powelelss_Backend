import { Request, Response, NextFunction } from "express";
import DeductionModel, { IDeductions } from "../models/deduction.models";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import StaffModel from "../models/staff.models";
import {
  GetAllDeductions,
  GetDeductionById,
} from "../services/deductions.services";

export const DeductionEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_no, month, year, nhif, nssf, advances, taxes } =
        req.body as IDeductions;
      if (!id_no && !nhif && !month && !year && !nssf && !advances && !taxes) {
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

      await DeductionModel.create({
        staff_member: staff._id,
        id_no,
        advances,
        month,
        year,
        taxes,
        nhif,
        nssf,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Deduction data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The deduction data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single deduction data
export const SingleDeductionData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetDeductionById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//Deduction data
export const AllDeductionsData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllDeductions(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IDeductionsUpdate {
  id_no: string;
  month: string;
  year: string;
  nhif: string;
  nssf: string;
  advances: string;
  taxes: string;
}
//update deduction data
export const UpdateDeductionData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id_no, advances, month, year, nhif, nssf, taxes } =
        req.body as IDeductionsUpdate;

      const { id } = req.params;

      if (!id_no && !advances && !month && !year && !nhif && !nssf && !taxes) {
        return next(
          new ErrorHandler("There is no information provided as an update", 422)
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
      const deduction = await DeductionModel.findById(id);
      if (!deduction) {
        new ErrorHandler("There is no deduction with the specified id", 409);
      }
      if (deduction && id_no) {
        deduction.id_no = id_no;
        deduction.staff_member = staff._id;
      }
      if (deduction && advances) {
        deduction.advances = advances;
      }
      if (deduction && month) {
        deduction.month = month;
      }
      if (deduction && nhif) {
        deduction.nhif = nhif;
      }
      if (deduction && year) {
        deduction.year = year;
      }
      if (deduction && nssf) {
        deduction.nssf = nssf;
      }
      if (deduction && taxes) {
        deduction.taxes = taxes;
      }
      await deduction
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            deduction,
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

// delete deduction
export const DeleteDeductionData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const deduction = await DeductionModel.findByIdAndDelete(id);
      if (!deduction) {
        return next(new ErrorHandler("The deduction doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The deduction data successfully deleted`,
        deduction,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
