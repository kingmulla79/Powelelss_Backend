import { Request, Response, NextFunction } from "express";
import StaffModel, { IStaff } from "../models/staff.models";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import { GetAllStaffData, GetStaffById } from "../services/staff.services";

//new staff entry
export const StaffEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        id_no,
        first_name,
        surname,
        P_no,
        phone_no,
        job_title,
        basic_salary,
      } = req.body as IStaff;

      await StaffModel.create({
        id_no,
        first_name,
        surname,
        P_no,
        phone_no,
        basic_salary,
        job_title,
      })
        .then(() =>
          res
            .status(201)
            .json({ success: true, message: "Staff data successfully saved" })
        )
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The staff data save operation was unsuccessful - ${error}`,
              400
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//single staff data
export const SingleStaffData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 400));
      }
      GetStaffById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

//single staff data
export const AllStaffData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllStaffData(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IStaffDataUpdate {
  id_no?: string;
  first_name?: string;
  surname?: string;
  phone_no?: string;
  job_title?: string;
  P_no?: string;
  basic_salary?: number;
}
//update staff data
export const UpdateStaffData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        id_no,
        first_name,
        surname,
        phone_no,
        P_no,
        job_title,
        basic_salary,
      } = req.body as IStaffDataUpdate;

      const { id } = req.params;
      if (
        !id_no &&
        !first_name &&
        !surname &&
        !phone_no &&
        !P_no &&
        !job_title &&
        !basic_salary
      ) {
        return next(
          new ErrorHandler("There is no information provided as an update", 400)
        );
      }
      const staff = await StaffModel.findById(id);
      if (!staff) {
        new ErrorHandler("There is no staff with the specified id", 400);
      }
      if (staff && id_no) {
        staff.id_no = id_no;
      }
      if (staff && first_name) {
        staff.first_name = first_name;
      }
      if (staff && surname) {
        staff.surname = surname;
      }
      if (staff && phone_no) {
        staff.phone_no = phone_no;
      }
      if (staff && P_no) {
        staff.P_no = P_no;
      }
      if (staff && job_title) {
        staff.job_title = job_title;
      }
      if (staff && basic_salary) {
        staff.basic_salary = basic_salary;
      }
      await staff
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            staff,
          });
        })
        .catch((error: any) => {
          return next(new ErrorHandler(error.message, 400));
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// delete staff
export const DeleteStaffData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const staff = await StaffModel.findByIdAndDelete(id);
      if (!staff) {
        return next(new ErrorHandler("The staff doesn't exist", 400));
      }

      res.status(200).json({
        success: true,
        message: `The staff ${staff.first_name} ${staff.surname} successfully deleted`,
        staff,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
