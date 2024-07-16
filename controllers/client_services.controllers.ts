import { Request, Response, NextFunction } from "express";
import ServiceModel, { IService } from "../models/client_services.models";
import ErrorHandler from "../utils/Errorhandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import {
  GetServiceById,
  GetAllServices,
} from "../services/client_services.services";
import StaffModel from "../models/staff.models";

export const ServiceCodeRetrieve = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latest_service = await ServiceModel.findOne().sort({
        createdAt: -1,
      });

      if (!latest_service) {
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
          count: latest_service.count + 1,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const ServiceEntry = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        client_name,
        invoice_code,
        work_location,
        scope,
        scope_description,
        staff_id,
        work_duration,
        date,
        cost,
        count,
      } = req.body;
      if (
        !client_name &&
        !invoice_code &&
        !work_location &&
        !scope &&
        !scope_description &&
        !staff_id &&
        !work_duration &&
        !date &&
        !cost &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const staff = await StaffModel.findOne({ id_no: staff_id });
      if (!staff) {
        return next(
          new ErrorHandler(
            "There is no staff member with the specified id number",
            409
          )
        );
      }

      await ServiceModel.create({
        client_name,
        invoice_code,
        work_location,
        scope,
        scope_description,
        staff_member: staff._id,
        work_duration,
        date,
        cost,
        count,
      })
        .then(() => {
          res.status(201).json({
            success: true,
            messsage: `Service data saved successfully`,
          });
        })
        .catch((error) => {
          return next(
            new ErrorHandler(
              `The service data save operation was unsuccessful - ${error}`,
              500
            )
          );
        });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//single service data
export const SingleServiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        return next(new ErrorHandler("There is no ID provided", 422));
      }
      GetServiceById(id, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//service data
export const AllServicesData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      GetAllServices(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

//update service data
export const UpdateServiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        client_name,
        invoice_code,
        work_location,
        scope,
        scope_description,
        staff_id,
        work_duration,
        date,
        cost,
        count,
      } = req.body;
      if (
        !client_name &&
        !invoice_code &&
        !work_location &&
        !scope &&
        !scope_description &&
        !staff_id &&
        !work_duration &&
        !date &&
        !cost &&
        !count
      ) {
        return next(
          new ErrorHandler(`Please provide all the required information`, 422)
        );
      }

      const staff = await StaffModel.findOne({ id_no: staff_id });
      if (!staff) {
        return next(
          new ErrorHandler(
            "There is no staff member with the specified id number",
            409
          )
        );
      }

      const { id } = req.params;

      const service = await ServiceModel.findById(id);
      if (!service) {
        new ErrorHandler("There is no service with the specified id", 409);
      }
      if (service && client_name) {
        service.client_name = client_name;
      }

      if (service && invoice_code) {
        service.invoice_code = invoice_code;
      }
      if (service && work_location) {
        service.work_location = work_location;
      }
      if (service && scope) {
        service.scope = scope;
      }
      if (service && scope_description) {
        service.scope_description = scope_description;
      }
      if (service && staff_id) {
        service.staff_member = staff._id;
      }
      if (service && work_duration) {
        service.work_duration = work_duration;
      }
      if (service && date) {
        service.date = date;
      }
      if (service && cost) {
        service.cost = cost;
      }
      if (service && count) {
        service.count = count;
      }

      await service
        ?.save()
        .then(() => {
          res.status(201).json({
            success: true,
            message: "Information successfully updated",
            service,
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

// delete service
export const DeleteServiceData = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const service = await ServiceModel.findByIdAndDelete(id);
      if (!service) {
        return next(new ErrorHandler("The service doesn't exist", 409));
      }

      res.status(200).json({
        success: true,
        message: `The quotation data successfully deleted`,
        service,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
